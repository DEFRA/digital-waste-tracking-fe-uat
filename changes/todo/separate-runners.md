# Todo: separate ext-test, compatibility, and BrowserStack

`selectedCapabilities` in `wdio.browserstack.conf.js` still mixes where and what:

- `ENVIRONMENT === 'ext-test'` forces the first capability, Windows Chrome, including smoke, compatibility, and admin-ui.
- The smoke, compatibility, and admin-ui scripts use every capability. The other BrowserStack scripts use the first capability. `BROWSERSTACK_DESKTOP_ONLY` is gone. Admin-ui is the full list, limited to scenarios tagged `@browserstack-admin-ui`.

Where, the suite, and the browser list are different choices. Ext-test is a where. It should have its own runners, including a smoke pack. It should not decide whether the run is the full browser list. Prod may want its own smoke pack. That is a separate where, not a branch in this function.

Compatibility is its own what. A likely home is its own WebdriverIO config, with the multi-browser list, rather than a branch inside the BrowserStack config. Running on BrowserStack is the how.

The generic login step has the same mix: outside ext-test, `@compatibility` in the extra tags takes a user from `availableUsers` before the login tags.

## Done when

- An ext-test run uses the ext-test runners. Smoke is one of them. The environment does not choose the capability list.
- A compatibility run is its own runner. It is not selected by `ENVIRONMENT`.
- A BrowserStack run that is not smoke, compatibility, or admin-ui uses that runner's browser list.
- A prod smoke pack is its own decision if prod becomes a where.
