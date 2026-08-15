# AGENTS.md

## Browser emulation

Whenever the integrated browser is opened/navigated for this project (via
`browser_navigate` or `browser_tab_open`), immediately call `browser_emulate`
on that tab to emulate a Galaxy S26. Galaxy S26 specs aren't public yet, so
use Galaxy S25 Ultra dimensions as a stand-in: width 384, height 824,
deviceScaleFactor 3.5, mobile true, userAgent set to a Samsung Android Chrome
UA string.

## Testing

Prefix mock functions/values with `mock_` (snake_case, even in an otherwise
camelCase codebase), e.g. `mock_onClick`. The visual break from camelCase
flags it as a mock at a glance — `mockOnClick` blends in with real code.

## Styling

When a theme-conditional decoration (e.g. only one theme adds it) would use
`border`, prefer `outline` instead. `outline` doesn't participate in layout,
so it can't change an element's rendered size across themes/variants — no
padding/sizing compensation needed. To sit flush against the edge like a
border would, set `outline-offset: calc(<width> * -1)` — the outline grows
outward from its offset line by its full width, so the offset must equal
the negative of the outline width or it will overhang the element by the
difference (half the width still overhangs by half).

## Comments

Never add prose comments (e.g. `// manages the state of X`) unless explicitly
requested — reserved for human maintainers. Write self-explanatory code
instead: name things so the code doesn't need narration.

Only rename an identifier if its current name is actually unclear or
misleading. Don't rename things that are already clear, and don't prefix
names with context the surrounding scope already provides (e.g. a local
inside the `Button` component doesn't need a `button` prefix).

Don't:

```jsx
// manages the state of the name input
const [text, setText] = useState("");
```

Do:

```jsx
const [nameInputValue, setNameInputValue] = useState("");
```
