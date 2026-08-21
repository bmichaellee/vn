---
name: red
description: Turn the highlighted it.todo (or named) test into a real failing unit test that fails for the right reason — the red step of TDD. Also covers re-redding an existing passing test after its requirements change. Use when the user says "/red", "make this test fail properly", or wants a todo stub converted into a failing test without implementing the feature.
---

# Red

Convert one `it.todo` stub into a real, failing unit test — and verify it fails for the **right reason** before stopping. Do not implement or modify the code under test.

The target isn't always a stub: an **existing passing test whose requirements changed** (e.g. the title or acceptance criteria were updated) is also a valid target — strengthen its assertions so it fails again under the new requirement. Same rules apply.

## Which test?

The test the user highlighted in the IDE (see `ide_selection`), or the one they named. If neither exists, **ask — list the candidates and stop**. Never assume a target (e.g. "the next `it.todo` in file order"): the user may intend a different stub, or a re-red of an existing test.

## Procedure

1. **Read the context.** Read the test file and the unit under test. Note existing test conventions in the file/repo (render helpers, `mock_` prefix for mocks, queries used) and follow them.
2. **Write the test.** Replace `it.todo("...")` with `it("...", ...)` containing real setup and assertions that express the desired behavior from the test title / acceptance criteria. Keep it minimal — one behavior per test.
3. **Run just that test** (e.g. `bunx vitest run <file> -t "<title>"` or the repo's test script) and inspect the failure.
4. **Check the failure reason.** The test must fail because the _behavior is missing_, not because the test itself is broken.

## Right reason vs. wrong reason

Right (stop here, report the failure output):

- An assertion fails: expected value/element/call not present because the feature isn't implemented yet.

Wrong (fix the test and re-run until failure is right):

- Import/module-not-found errors, typos, syntax errors.
- Wrong query/selector that would miss the element even after implementation.
- Test-environment errors (missing provider/setup the _test_ needs, not the feature).
- The test **passes** — it's not asserting the new behavior; strengthen the assertion.

If the failure can't be made "right" without changing production code beyond a trivial export, that's expected red-phase reality only when the assertion itself is what fails. A crash inside the component before the assertion (e.g. render throws) counts as right _only if_ the throw is the missing behavior itself; otherwise tighten the test.

## Stop condition

End with: the final test code in place, the test run output showing the failure, and one sentence stating why the failure is the right reason. Do **not** implement the feature to make it pass — that's the green step, not this skill.
