---
name: walkthrough
description: Spec out an entire milestone or feature by walking through the user's exact journey step by step, discovering gaps, splitting conflated issues, and wiring real dependencies between them. Use when the user wants to flesh out a milestone, a stub-issue cluster, or an epic end-to-end — e.g. "walk through the import flow", "let's spec out per-user dashboards", "find the gaps in this milestone". Not for filing a single issue (see issue) or triaging a backlog of unrelated stubs (see stub-issue-triage).
argument-hint: "[milestone name, issue number, or feature description]"
---

# Walkthrough Skill

Use this when a milestone or feature needs to go from a loose set of issues (or stubs) to a fully-scoped, human-testable, correctly-linked set of tickets. The engine of this skill is acting out the user's exact steps and asking, after each one, "what issue covers this?" — gaps and conflated scope surface naturally that way, in a way that reading titles or acceptance criteria in isolation won't reveal.

This skill does not draft or create issues itself — every actual creation, update, or blocker-wiring call is delegated to the `issue` skill. This skill is the loop that decides _when_ to call it and _what_ to tell it.

Don't scan the codebase for this either, for the same reason `issue` avoids it: looking at existing implementation can anchor the spec to whatever bugs or shortcuts are already there. The one exception is a narrow, explicit check of "does X already exist" (e.g. "is there a navigation system already") when the user's description depends on knowing that — do the check, report the finding, and get back to spec'ing from intent.

## Procedure

### 1. Establish the starting point

Get the milestone name, stub-issue cluster, or seed issue the walkthrough is building on. List its current open issues (`gh issue list --milestone "<name>" --state open`) — then read every body up front, not just the titles. The walkthrough constantly asks "what covers this step?", and that question is unanswerable from titles: acceptance criteria routinely hide concepts (a fallback group, a visual treatment, a naming decision) that a title never hints at.

### 2. Narrate the journey, one concrete step at a time

Ask the user to describe the very next thing the user (in the product, not the developer) would do or see — one action or observation per turn, not the whole flow at once. Keep it concrete: "I click X", "I see Y", "I'd expect Z to happen next." Don't skip ahead or fill in steps yourself; the user's actual mental model of the flow is the point, and it will surface things a spec written top-down would miss (see the log of this skill's own origin session for examples: a missing navigation entry point, a batch/finalize model that only came up when asked "does this write to the table one row at a time?").

### 3. After each step, ask what covers it

Check the step against the existing issues. One of four things is true:

- **An issue clearly covers it.** Say which one, move to the next step.
- **It sounds new but is existing spec in the user's words.** The user describes the product in their own vocabulary, which rarely matches the tickets' vocabulary (their "catch-all pseudo-domain" may be an existing issue's "Unsorted milestone fallback"; their "glowing border" may already be an AC on a sibling issue). Before drafting anything, asking a naming question, or amending an issue, re-read the bodies of the _adjacent_ issues — not just the one you're about to touch — and check whether the concept already exists under a different name. Creating a parallel concept (or a second copy of an AC) is worse than a gap: it ships two names for one thing.
- **No issue covers it.** Draft a new one via the `issue` skill's drafting procedure (ask clarifying questions, draft, confirm, create).
- **An issue sort-of covers it, but its acceptance criteria aren't independently human-testable.** This is usually a sign the issue conflates two concerns (commonly API vs. UI, or business logic vs. presentation) or silently assumes infrastructure that doesn't exist yet (e.g. "reachable from the app's navigation" when there is no navigation system). Split or rewrite it — see step 4.
- **The step reveals a design/policy decision, not a missing ticket.** Ask the user directly rather than guessing; don't let "keep momentum" pressure you into inventing product decisions.

### 4. Split conflated scope and flag missing infrastructure

When an issue mixes concerns, split it into the pieces that are each independently testable (e.g. "endpoint that maps rows" vs. "UI that displays the mapped rows and calls the endpoint"). When a step depends on infrastructure that doesn't exist (navigation, a shared component, a design system primitive), spin that up as its own issue rather than burying it as a criterion on the feature issue — infrastructure gets reused by later work, feature-specific criteria don't.

A recurring special case: when a feature's UI needs a visual primitive (a badge, a skeleton loader, a modal), split it into a generic component issue in the "User Interface" milestone — no knowledge of the feature, theme-based, design sign-off required — plus a feature-specific consumer issue blocked by it. Lock in the component name (e.g. `<Badge />`) in the issue so implementers don't bikeshed it.

When splitting or creating reveals that an existing issue's title no longer matches its (now corrected) spec, rename it as part of the same edit — don't leave a stale title next to an accurate body.

### 5. Flag human-judgment points explicitly

Some steps need a real design, security, or policy decision — not an AI's best guess. When one comes up (visual placement, styling, a tradeoff with no clearly-correct default), say so out loud to the user in the moment, and if it produces a ticket, put a criterion in that ticket's acceptance criteria saying so explicitly (e.g. "Requires human design sign-off before implementation — an AI agent must not design and ship this unilaterally"). The goal is that a future agent picking up the ticket cold stops and asks, instead of running ahead.

### 6. Keep the dependency graph live as you go

As soon as a new issue depends on another (or an old dependency turns out to be wrong because of a split), wire it up immediately using the `issue` skill's blocker-relationship instructions — don't batch this to the end and don't write "Depends on #X" text as a placeholder. Real relationships are cheap to set as you go and expensive to reconstruct from memory later.

### 7. End with a consistency sweep

Once the journey is fully walked, sweep every issue touched during the walkthrough:

- Re-read each one: does the title still match the body's spec?
- For each, audit both `blockedBy` and `blocking` (per the `issue` skill's instructions) — look for stray edges left over from a since-corrected text mention, or backwards edges from before a split (e.g. a schema issue that ended up blocked by the feature it should be blocking).
- Grep each body for leftover "Depends on" / "feeds into" / "hands off to" text and remove it now that the relationship is real.

Report the final shape of the graph to the user (which issue blocks which) so they have a mental model of the build order without needing to click through GitHub.

### 8. Offer to improve this skill

If a walkthrough surfaces a recurring pattern this skill doesn't yet handle well (e.g. a new class of scope conflation, a step that repeatedly needed the same kind of infra check), offer to fold it back into this file once the walkthrough is done.
