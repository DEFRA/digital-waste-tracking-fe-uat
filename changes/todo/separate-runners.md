# Todo: separate ext-test, compatibility, BrowserStack, and desktop-only

`selectedCapabilities` in `wdio.browserstack.conf.js` mixes three choices into one list:

- `ENVIRONMENT === 'ext-test'` forces the first capability, Windows Chrome.
- `CUCUMBER_EXTRA_TAGS` containing `@compatibility` returns every capability, unless the environment is ext-test.
- `BROWSERSTACK_DESKTOP_ONLY` drops the device capabilities, and that check runs first, so it also wins over compatibility and ext-test. `test:browserstack:admin-ui` sets that variable.

Where, the suite, and the browser list are different choices. Ext-test is a where. It should have its own runners, including a smoke pack. It should not decide whether the run is the compatibility matrix. Prod may want its own smoke pack. That is a separate where, not a branch in this function.

Compatibility is its own what. A likely home is its own WebdriverIO config, with the multi-browser list, rather than a flag read inside the BrowserStack config. Running on BrowserStack is the how. A BrowserStack run is not a compatibility run.

Desktop-only is the admin-ui browser list. It is its own runner choice, not a filter that overrides the others.

The generic login step has the same mix: outside ext-test, `@compatibility` in the extra tags takes a user from `availableUsers` before the login tags.

## Done when

- An ext-test run uses the ext-test runners. Smoke is one of them. The environment does not choose the capability list.
- A compatibility run is its own runner. It is not selected by `ENVIRONMENT`.
- A BrowserStack run that is not compatibility uses that runner's browser list.
- Admin-ui desktop-only is that runner's list, and it does not override compatibility or ext-test.
- A prod smoke pack is its own decision if prod becomes a where.
