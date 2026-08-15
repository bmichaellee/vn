#!/usr/bin/env node
import {
  existsSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  symlinkSync,
  unlinkSync,
  readlinkSync,
} from "node:fs";
import { homedir } from "node:os";
import { join, resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const repoSkillsDir = resolve(
  dirname(fileURLToPath(import.meta.url)),
  "..",
  ".agents",
  "skills",
);
const agentsSkillsDir = join(homedir(), ".agents", "skills");
const claudeSkillsDir = join(homedir(), ".claude", "skills");

function linkStatus(linkPath, target) {
  if (!existsSync(linkPath) && !isLink(linkPath)) return "missing";
  if (!isLink(linkPath)) return "conflict";
  return readlinkSync(linkPath) === target ? "ok" : "stale";
}

function isLink(path) {
  try {
    return lstatSync(path).isSymbolicLink();
  } catch {
    return false;
  }
}

function ensureLink(linkPath, target) {
  const status = linkStatus(linkPath, target);
  if (status === "ok") {
    console.log(`ok      ${linkPath}`);
    return;
  }
  if (status === "conflict") {
    console.error(
      `SKIP    ${linkPath} exists and is not a symlink — resolve manually`,
    );
    process.exitCode = 1;
    return;
  }
  if (status === "stale") unlinkSync(linkPath);
  symlinkSync(target, linkPath, "junction");
  console.log(
    `${status === "stale" ? "relink" : "link"}    ${linkPath} -> ${target}`,
  );
}

mkdirSync(agentsSkillsDir, { recursive: true });

ensureLink(claudeSkillsDir, agentsSkillsDir);

for (const entry of readdirSync(repoSkillsDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  ensureLink(
    join(agentsSkillsDir, entry.name),
    join(repoSkillsDir, entry.name),
  );
}
