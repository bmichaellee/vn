---
name: prepare
description: Prepare files for implementing an issue without actually implementing it. Use when the user wants the groundwork laid for an issue — e.g. "/prepare 58" — but no implementation.
---

# Prepare Skill

Prepare the workspace and files needed to implement an issue, without implementing anything.

If you run into any snags while using this skill, offer to improve the skill once completed. Snags are not just incorrect output, but also confusing prompts, missing information, bloat, or anything else that makes the skill burn cycles or tokens unnecessarily. In particular, this skill was developed against a UI component — expect gaps when preparing other feature shapes (API endpoints, services, etc.) and offer refinements when they surface.

## Procedure

### 1. Cut a branch

In the main worktree, fetch and cut a topic branch from the repo's up-to-date default branch, e.g. `git fetch origin && git switch -c <topic> origin/<default-branch>`. Name it after the issue (e.g. `issue-85-progress-bar`).

Bash tool calls keep whatever working directory a prior `cd` left behind — including a `cd` used just to poke around (e.g. `cd some/dir && cat *`). Before creating files (step 2 onward), confirm you're operating from the repo root: use absolute paths, or run a plain `pwd`-checked command first. Otherwise `mkdir -p`/file writes can land nested inside whatever directory you last `cd`'d into, silently duplicating the scaffold.

### 2. Read the ticket and work out the implied files

Read the issue (`gh issue view <number>`). From its acceptance criteria, work out which new files the implementation implies (following the repo's conventions — e.g. directory-per-unit, barrels, colocated tests). Include API endpoints the AC implies (e.g. "auth state is determined by calling `GET /v0/auth/session`"), not just client units. Do not implement anything.

Some (or most) of the implied units may already exist as shells from earlier issues. Check before creating anything: for units that exist, extend in place — add the new method/route shell to the existing file and new `it.todo`s to the existing test file — rather than creating parallel files or re-scaffolding. The scaffold for an issue is the delta, not the full unit list.

### 3. Scaffold shells

Create the non-test files as shells (test files are created in step 4):

- **Barrels:** fill out normally (real exports for the unit).
- **Endpoints:** a route shell following the repo's route conventions (prefix, docs file, wired into the routes barrel) whose handler returns a static placeholder response — no real logic.
- **Components:** a minimal named shell with placeholder comments, e.g.:

```tsx
interface ProgressBarProps {
  // Types go here
}

export const ProgressBar = (
  {
    // Props go here
  }: ProgressBarProps,
) => <div>Progress Bar</div>;
```

### 4. Create the test file(s), stubbed from the AC

Create each test file with title-only `it.todo` tests. The acceptance criteria are the input, not the output: don't transcribe each criterion into a todo. For each criterion, ask what behavior would break if the implementation were wrong, and write a todo only where a unit test would catch that. A good todo names an observable behavior with a concrete trigger and outcome (`does not fire onClick when disabled`), not a restatement of the AC (`supports a disabled state`).

Skip criteria a unit test can't meaningfully assert or that only restate the element's existence:
- Process-only ones (e.g. sign-off requirements) and architectural constraints (e.g. "no X logic lives in the client" — proving a negative about implementation internals is a code-review concern, not a test).
- Visual ones ("styled with Tailwind", "matches the Rails page", "renders a primary-styled button") — asserting class names tests the implementation, not the behavior. Leave these to the ticket's manual verification.
- Smoke todos like `renders` or `renders without props` — every real test already renders the unit.

Fewer, sharper todos beat a one-to-one copy of the AC. No callbacks or assertions yet:

```tsx
import { describe, it } from "vitest";

describe("<ProgressBar />", () => {
  it.todo("clamps values above 100 to a full bar");
});
```

That's it — stop here. No implementation, no assertions; the point is to leave groundwork that a human signs off on before anything ships.

## Variations

- **Non-default base branch:** if the argument names a base (e.g. "branch off release/1.0.x"), cut from that instead of the default branch.
- **Bug tickets on existing code:** there are usually no new units. Investigate where the behavior lives, then the scaffold is just test stubs appended to the existing test files for the units involved. Summarize the investigation findings to the user (and on the issue if it has an investigation AC).
- **Minitest (Rails):** there is no `it.todo`. Stub with `test '...' do skip end` appended before the file's final `end`. Note any missing fixtures/env vars (e.g. `ENV` values used by the code but unset in test config) that `/red` will need.
