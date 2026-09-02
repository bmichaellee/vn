---
name: story
description: Run an existing story from .agents/stories/ step by step in the browser and report whether it still holds. Use when the user says "/story login" or wants a flow verified against reality.
---

# Story Skill

Run a story exactly as written and report the outcome.

If you run into any snags while using this skill, offer to improve the skill once completed. Snags are not just incorrect output, but also confusing prompts, missing information, bloat, or anything else that makes the skill burn cycles or tokens unnecessarily.

## Rules

- Never look at code while running a story — only the browser and the story file.
- Follow the steps literally; don't improvise workarounds.
- A step that can't be performed, or whose expected result doesn't appear, ends the run.

## Procedure

1. Read `.agents/stories/story-<name>.md` and satisfy its prerequisites (`bun run dev` if the app isn't up; PWA at http://localhost:6102). Run any linked prerequisite story first.
2. Perform each step in the browser, emulated per AGENTS.md, comparing what happens against the step's expected result.
3. Report the outcome: **passed**, or **stopped at step N** with what actually happened instead. When reality and the story disagree, offer to update the story or file an issue for the gap.
