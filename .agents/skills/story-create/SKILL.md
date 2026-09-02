---
name: story-create
description: Create a story — a step-by-step, browser-reproducible guide through one user flow — by actually walking the flow in the running app. Use when the user wants a new story documented, e.g. "/story-create logout".
---

# Story Create Skill

Create a story file in `.agents/stories/` named `story-<slug>.md`. A story is a numbered walk through one user flow, written so a human can follow it in a browser — though an AI agent is its most likely runner.

If you run into any snags while using this skill, offer to improve the skill once completed. Snags are not just incorrect output, but also confusing prompts, missing information, bloat, or anything else that makes the skill burn cycles or tokens unnecessarily.

## Rules

- Walk the real app in the browser while writing. Never look at code: the story documents what the app actually does, and part of its job is discovering what doesn't work yet.
- If a step is impossible (missing data, missing feature, dead end), stop. That is the end of the story — record the blocker instead of imagining the rest.
- Stories can chain: link a prerequisite story instead of repeating its steps.

## Procedure

1. Make sure the app is running (`bun run dev`; the PWA serves at http://localhost:6102).
2. Walk the flow step by step in the browser, emulated per AGENTS.md. At each step note the action taken and what visibly results.
3. Write `.agents/stories/story-<slug>.md`:
   - Title and a one-line description
   - **Prerequisites**: what must be true before step 1 (bootstrap, app running, linked prerequisite stories)
   - **Steps**: numbered; each an action plus the expected visible result
   - **Blocked** (only if hit): which step is impossible and exactly why
4. If blocked, surface the blocker to the user — it is usually a missing issue waiting to be filed.
