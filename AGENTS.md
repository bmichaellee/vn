# AGENTS.md

## Browser emulation

Whenever the integrated browser is opened/navigated for this project (via
`browser_navigate` or `browser_tab_open`), immediately call `browser_emulate`
on that tab to emulate a Galaxy S26. Galaxy S26 specs aren't public yet, so
use Galaxy S25 Ultra dimensions as a stand-in: width 384, height 824,
deviceScaleFactor 3.5, mobile true, userAgent set to a Samsung Android Chrome
UA string.
