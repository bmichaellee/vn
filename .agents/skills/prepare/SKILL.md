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

### 2. Read the ticket and create the implied files

Read the issue (`gh issue view <number>`). From its acceptance criteria, work out which new files the implementation implies (following the repo's conventions — e.g. directory-per-unit, barrels, colocated tests) and create them **empty**. Do not write any content or implement anything.

### 3. Scaffold shells

Fill the new files with shells — except test files, which stay empty for now:

- **Barrels:** fill out normally (real exports for the unit).
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

### 4. Stub the test file from the AC

Fill each test file with title-only `it.todo` tests derived from the acceptance criteria — one per testable criterion (skip process-only criteria like sign-off requirements). No callbacks or assertions yet:

```tsx
import { describe, it } from "vitest";

describe("<ProgressBar />", () => {
  it.todo("uses theme-based styling");
});
```

For generic/reusable UI components, also add a `renders without props or context` todo — generic components tend to grow dependencies they don't need, and this test guards against that.

That's it — stop here. No implementation, no assertions; the point is to leave groundwork that a human signs off on before anything ships.
