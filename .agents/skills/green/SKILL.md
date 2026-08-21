---
name: green
description: Implement the minimal production code to make the currently failing test(s) pass — the green step of TDD, companion to /red. Also covers backfilling a test stub for behavior that already exists (restoring lost coverage). Use when the user says "/green", "make it pass", or wants the feature implemented for a red test without touching the test itself.
---

# Green

Make the failing test(s) pass with the **minimal** production change — and verify green before stopping. Do not modify the tests.

## Which test?

The failing test the user highlighted in the IDE (see `ide_selection`), or the one they named. If neither, run the nearest test file and target its failing tests. If nothing is failing, say so and stop.

**Backfill variant:** when the target is a test stub (an `it.todo` or bare `it("...")` with no body) for behavior that **already exists** — e.g. restoring coverage lost when code moved or a component was deleted — write the test so it _passes_, following /red's conventions (existing helpers, `mock_` prefix, repo queries). Production code stays untouched; if the test unexpectedly fails, the behavior is actually missing — report and switch to the normal red/green flow instead of "fixing" it here.

## Procedure

1. **Read the context.** Read the failing test and the unit under test. The test is the spec — implement exactly what it asserts, nothing more.
2. **Run the test first** to confirm it's red and see the actual failure (e.g. `bunx vitest run <file> -t "<title>"`).
3. **Implement minimally.** Change only the production code needed to satisfy the assertions. Follow repo conventions and styling rules (see AGENTS.md). Don't gold-plate: no extra props, options, or refactors the test doesn't demand.
4. **Re-run the targeted test** until it passes.
5. **Run the whole test file** (and clear any TS diagnostics introduced by the red step) to confirm nothing else broke.

## Hard rules

- **Never edit the test to make it pass.** If the test looks wrong (bad selector, impossible assertion), stop and report — fixing tests is /red's job.
- Skipped/`it.todo` tests stay untouched.
- If passing would require a design decision the test doesn't pin down (e.g. two plausible APIs), pick the simplest one that satisfies the test and note the choice.

## Stop condition

End with: the production change in place, test output showing the targeted test (and the rest of its file) passing, and one sentence on what was implemented. Do **not** add new tests or refactor beyond the pass — that's a later step.
