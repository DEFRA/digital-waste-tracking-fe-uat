# Test framework

This is the suite after the refactor. The spec is `changes/done/test-framework-refactor-plan.md` and is not edited. `changes/ai-revision-log.md` is the ordered record of what changed. The Cursor rules are what a later change follows. Open work is in `changes/todo/`.

## Where, how, and what

A run is three choices.

- **Where** is `ENVIRONMENT`: `local`, `dev`, `test`, `ext-test`, `perf-test`. It selects the support file. `local` is the Compose host for every driver. Dev and perf-test use the Defra ID stub host. Test and ext-test use real Defra ID. A stub journey pointed at real Defra ID is a config error.
- **How** is the driver. `wdio.grid.conf.js` is the remote Chrome for a laptop, CDP, and GitHub. `wdio.local.conf.js` is the developer's Chrome. `wdio.browserstack.conf.js` is BrowserStack. There is no separate local-grid config and no GitHub config.
- **What** is the suite on that driver: `regression:defra-id-stub`, `regression:defra-id-real`, `smoke`, `debug`, `admin-ui`. `test:zap` is the grid with `@zap` and `AnalyseZapReport.feature`. `test:browserstack:compatibility` is the only compatibility runner.

Tags do not choose the driver. The driver does not choose the URL. `npm test` is `test:${PROFILE}`. `PROFILE` is the runner after `test:`, for example `grid:smoke`. The test scripts do not source `env.sh`. A laptop sets `PROFILE` and runs `source:clean:test:report`. CDP and GitHub set `PROFILE` and call `npm test`. `entrypoint.sh` still runs `npm test`, then publishes the report, and exits 1 when a `FAILED` file exists.

## Tags and login

`buildCucumberTagExpression` returns `CUCUMBER_EXTRA_TAGS` alone. An empty value runs every scenario. `@env_*` is not a filter and is not on the live feature lines.

`@defra-id-stub` and `@defra-id-real` choose the login journey. One tag wins. Both tags follow `CUCUMBER_EXTRA_TAGS` when that chooses one of them, and the step throws when it does not. Admin features and `AnalyseZapReport` have no login tag. Two service-charge outlines still have no scenario login tag. Their example rows carry the tag.

`@compatibility` is set by `test:browserstack:compatibility`. Outside ext-test, the generic login step takes a user from `availableUsers` before it looks at the login tags. Ext-test basic auth is the login form, including after a relogin.

## Config

`TestEnv` getters read `process.env` when called. `TestConfig` takes a prefix and `proxyMode` and loads `test/support/<prefix>.config.json`. `zap` loads `<prefix>.zap`. The driver configs pass `testEnv.environment` and `testEnv.proxyMode`. The user-pool seed passes `test` and no proxy mode, and it runs only when `ENVIRONMENT` is `test`, so it reads `test.config.json`.

Secrets stay in Portal config or `env.sh`. Steps read `this.testEnv` and `this.testConfig`. Scenario values sit on `this.testMemory`. There is no custom Cucumber world.

Each driver config defines its own WebdriverIO hooks. Shared steps live in `test/setup/wdio-shared.js`. The first scenario of a worker skips `reloadSession()`. Later scenarios reload. A failed step or scenario is screenshotted. The grid and BrowserStack write `FAILED`. The grid builds the accessibility index. Local Chrome publishes the ZAP report and opens Allure.

The grid host is `GRID_HOST`, then `CHROMEDRIVER_URL`, then `127.0.0.1`. The port is `GRID_PORT`, then `CHROMEDRIVER_PORT`, then `4444`. `connectionRetryTimeout` is 120000 on the grid and BrowserStack, and 60000 on local Chrome. `connectionRetryCount` is 3. `MAX_INSTANCES` defaults to 1.

## Proxy

`HTTP_PROXY` is the one URL. `PROXY_MODE` is `off`, `cdp`, or `zap`. Unset means `cdp` when `HTTP_PROXY` is set, and `off` when it is not. `off` ignores the proxy. `cdp` sends Cognito, GOV.UK Pay, and the grid or local Chrome through it. `zap` sends the grid and local Chrome, and the service clients, through ZAP. The ZAP client itself is not proxied. Compose starts ZAP on port 8080. BrowserStack's remote browser is not given the proxy. The runner uses it to reach BrowserStack.

## Left open

Open work is in `changes/todo/`: a scenario must run in isolation, adding workers above the `MAX_INSTANCES` default of 1 waits on that, BrowserStack is not started from GitHub, and the BrowserStack capability list still mixes ext-test, compatibility, and desktop-only. The Allure report is always published after the run. Moving more non-secret test data into the config classes was left and is not a current task.
