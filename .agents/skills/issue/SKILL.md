---
name: issue
description: Create or update a single issue in the repository from user intent. Use when the user says "file a bug", "open an issue", "log a feature request", or wants to update an existing issue's details. Not for triaging a backlog of stub issues (see stub-issue-triage) or implementing an issue end-to-end (see issue-to-merged-pr).
argument-hint: "[issue description or number]"
---

# Issue Skill

Use this when asked to create or update an issue in the repository. Don't scan the codebase; this is purely for gathering intent, and looking at active code may mislead you into creating a spec that perpetuates existing bugs or design flaws. Instead, focus on the user's intent and the problem they are trying to solve.

If you run into any snags while using this skill, offer to improve the skill once completed. Snags are not just incorrect output, but also confusing prompts, missing information, bloat, or anything else that makes the skill burn cycles or tokens unnecessarily.

## Procedure

### 1. Look at open issues

Before creating a new issue, check the repository's open issues to see if there is already an existing issue that matches the user's intent. If a matching issue is found, ask the user if they would like to update that issue instead of creating a new one.

Use `gh issue list --state open --search "<keywords>"` (or `glab issue list --search "<keywords>"` on GitLab) to search.

This will also help with identifying relationships like blockers, dependencies, or related issues.

### 2. Ask for additional details

Thoroughly question the user to gather an accurate intent for the issue. Don't move on from this step until the intent is clear. Do not scan the codebase.

Run `gh label list` and `gh api repos/{owner}/{repo}/milestones` to see what actually exists — don't guess or invent label/milestone names. Recommend a milestone if one isn't provided from that list; if none matches the intent, offer to create a new one. If the user doesn't provide labels, assign from the existing set based on the intent.

### 3. Draft the issue

The issue should be drafted like the following example:

---

- **Title:** Example Issue
- **Labels:** Bug • Tooling
- **Milestone:** Some Milestone

- **User Story:** As a user, I want to be able to create an issue in the repository so that I can report bugs or request features.

- **Acceptance Criteria:**
  - [ ] Submitting the form with a title and description creates an issue with that exact title and body
  - [ ] The created issue has exactly the labels selected in the form
  - [ ] The issue appears in `gh issue list` immediately after creation

- **Verification:** Fill out the form in the app, then open the repository's issues page in a browser and see the new issue at the top of the list.

---

Also mention any potential blockers or dependencies that may affect the issue's resolution. Once the issue is created, wire these up as real tracked relationships (see "Setting up blocker relationships" below) — never as "Depends on #X" text in the body. Text mentions rot silently when an issue is renamed or renumbered; a real relationship shows up in GitHub's UI and stays accurate.

If the issue is a Request (its body contains a user ID), the user story is potentially user-facing — it may be shown to that user in the app. User stories are generally safe to reveal anyway, but write (and rewrite) them with that audience in mind.

User stories should be non-technical, and acceptance criteria should be deterministic. A line in the acceptance criteria should read like a realistic unit test, for example.

**Verification** is one sentence describing how a plain human — no tooling, no curl, no test runner — could check the change works. If that's genuinely impossible (pure infra/internal code), say so explicitly: "Not human-verifiable; verification is the automated test suite." But if a one-sentence human check is hard to come up with, treat it as a smell — the issue may need its scope expanded until something observable exists.

### 4. Ask for confirmation

Post the drafted issue as a normal conversational message and explicitly ask whether the title, description, and acceptance criteria reflect the user's intent. Do **not** write anything to GitHub yet — the draft must exist only in chat until the user replies with approval. If the reply is anything other than an unqualified "yes" — even a small addition like "one more AC" — apply the feedback, re-post the full revised draft so the change can be seen in context, and ask again. Only plain approval of the draft as posted moves to step 5.

Do not use AskUserQuestion's confirm/approve-style options for this — a single-option "looks good, proceed?" prompt is rejected by the tool, and repurposing it by applying the change first and asking after the fact is not real review (a user has explicitly flagged this as unacceptable in this repo). Plain conversational back-and-forth is the right tool here; reserve AskUserQuestion for genuine multi-choice branches encountered while gathering intent (step 2), not for sign-off on a finished draft.

### 5. Create or update the issue

Only once the user has replied with explicit approval in conversation — not before — proceed to create or update the issue in the repository. Ensure that all details are correctly entered and that the issue is properly labeled and categorized.

Use `gh` or `glab` CLI commands to create or update the issue in the repository. For example, to create a new issue, you can use:

```bash
gh issue create --title "Example Issue" --label "Bug,Frontend" --milestone "Some Milestone" --body "$(cat <<'EOF'
**User Story:** As a user, I want to be able to create an issue in the repository so that I can report bugs or request features.

**Acceptance Criteria:**
- [ ] Submitting the form with a title and description creates an issue with that exact title and body
- [ ] The created issue has exactly the labels selected in the form
- [ ] The issue appears in `gh issue list` immediately after creation

**Verification:** Fill out the form in the app, then open the repository's issues page in a browser and see the new issue at the top of the list.
EOF
)"
```

`glab issue create` takes the equivalent flags (`--label`, `--milestone`, `--description`) on a GitLab remote. To update an existing issue instead, use `gh issue edit <number>` / `glab issue update <id>` with the same flags.

### 6. Confirm creation or update

After creating or updating the issue, confirm with the user that the action was successful. Provide a link to the issue in the repository, and offer to implement it if they would like to work on the issue immediately.

If the issue has relationships with other issues, ensure that those relationships are properly set up in the issue tracker (see below) — not just mentioned in the body text.

#### Setting up blocker relationships

On GitHub, real "blocked by" relationships are not exposed as `gh issue` flags — they're set via the GraphQL API's `addBlockedBy` mutation (and removed with `removeBlockedBy`). Both take issue _node IDs_ (not issue numbers). Do not use a standalone `jq` binary — it is not installed on every host; `gh`'s built-in `-q`/`--template` flags cover everything needed. Define these helpers once per shell call and use them for every edge:

```bash
id(){ gh issue view "$1" --json id -q .id; }
link(){ gh api graphql -f query='mutation($issueId:ID!,$blockingIssueId:ID!){ addBlockedBy(input:{issueId:$issueId, blockingIssueId:$blockingIssueId}) { issue { number } } }' -f issueId="$(id $1)" -f blockingIssueId="$(id $2)" -q '.data.addBlockedBy.issue.number'; }
unlink(){ gh api graphql -f query='mutation($issueId:ID!,$blockingIssueId:ID!){ removeBlockedBy(input:{issueId:$issueId, blockingIssueId:$blockingIssueId}) { issue { number } } }' -f issueId="$(id $1)" -f blockingIssueId="$(id $2)" -q '.data.removeBlockedBy.issue.number'; }

# "#24 is blocked by #23"
link 24 23
# undo it when a dependency turns out to be wrong or an issue gets re-split
unlink 24 23
```

`id` works for closed issues too, so there is no need to search the open list. To audit an issue's current relationships (both directions, in one line per issue):

```bash
for n in 23 24; do gh api graphql -f query="query { repository(owner:\"OWNER\", name:\"REPO\") { issue(number:$n) { blockedBy(first:20){nodes{number}} blocking(first:20){nodes{number}} } } }" --template "#$n blockedBy: {{range .data.repository.issue.blockedBy.nodes}}{{.number}} {{end}}| blocking: {{range .data.repository.issue.blocking.nodes}}{{.number}} {{end}}"; echo; done
```

A stray or incorrect edge (e.g. left over from a since-removed text mention, or from splitting/renaming an issue) is easy to miss — check both `blockedBy` and `blocking` after wiring up a batch of issues, not just the ones you just added.

On GitLab, use `glab issue update <id> --linked-issues` / `glab issue link` (blocks/is-blocked-by) for the equivalent.

### 7. Offer to improve the skill

See the note at the top of this skill — offer only if a snag actually occurred.
