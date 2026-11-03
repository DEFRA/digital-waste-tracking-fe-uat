# AI revision log

What changed, in the order it happened, so a later change can be unpicked. The current configuration is the Cursor rules and `changes/done/test-framework.md`. `changes/todo/` is open work. `changes/done/` is finished work. `changes/done/test-framework-refactor-plan.md` is frozen. It still says this log lives at the repo root. That path is historical.

Append the next numbered section when a decision moves or the suite's behaviour changes. Leave older sections as they were. Each section names `git config --global user.name`, the UTC time from `date -u`, and the commit it was made on top of (`git rev-parse --short=12 HEAD`). Then say what changed, concretely enough to unpick, and which rule or note it covers.

Sections 1 to 45 were made on top of `56b46ea6e095` and recorded together in `cd12b0e` at 2026-11-02 14:45 UTC. That commit is the only clock they have. Sections 46 to 62 were made on top of `cd12b0e9dd4b` on 2026-11-03, before each entry kept its own clock.

## 1. Revision log

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Created `ai-revision-log.md` so later changes are appended here instead of edited into the spec.

## 2. Cursor rules

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Added `.cursor/rules/test-framework.mdc`, `proxy-sessions-report.mdc`, `config-and-paths.mdc`, and `local-npm.mdc`.

## 3. Notes

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Removed the scaffold comments from the WebdriverIO configs. Proxy, session timeout, the `FAILED` file, and why dev and test differ moved into the Cursor rules.

## 4. Setup folder

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Added `test/setup/` and pointed the driver configs at it. `test-config.js` loaded the support JSON and exposed env vars as getters. Secrets stayed in the environment. `local` is the Compose host for every driver.

`ApiFactory` read `PROXY_MODE`. `cdp` proxied Cognito and GOV.UK Pay. `zap` also proxied the other service clients. The ZAP client was not sent back through the proxy. `xapikey` still rewrote the two backend URLs.

Hooks were shared. Each driver kept its own capabilities, host, and services. `MAX_INSTANCES` defaulted to 1. `onPrepare` filled the test-environment user pools, and on BrowserStack the combined `availableUsers` pool, and opened a ZAP session when the mode was `zap`. `onComplete` wrote `FAILED` for the sidecar and BrowserStack, and built the accessibility index for the sidecar. Local Chrome and the grid opened the Allure report.

Unset `PROXY_MODE` means `cdp` when `HTTP_PROXY` is set, and `off` when it is not. Any other set value throws. Local Chrome and the grid expire stub users with `defraIdStubAPI.expireUser`. A zap-mode run writes `zap-report/` from `onComplete`.

Covers: `.cursor/rules/config-and-paths.mdc`, `.cursor/rules/proxy-sessions-report.mdc`.

## 5. Scripts

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`npm test` / `PROFILE` stayed. `test:browserstack` stopped sourcing `env.sh` and stopped forcing `@smoke`. `test:browserstack:local` sourced `env.sh`. `test:browserstack:regression` stopped forcing `not @smoke`. Removed `test:zap`, `test:github`, and `test:github:browserstack`. Admin-tool specs could run on the sidecar, local Chrome, the grid, and BrowserStack. `BROWSERSTACK_DESKTOP_ONLY` stayed on the BrowserStack admin-tool scripts. `@compatibility` selected the multi-browser BrowserStack list.

`compose.yml` starts ZAP on port 8080. The journey-test workflow sets `HTTP_PROXY`, `PROXY_MODE=zap`, and `ZAP_API_KEY`. That workflow's template action checks out its own repository, so it cannot run this suite's gate as a second step. The gate stayed `AnalyseZapReport.feature` with `PROXY_MODE=off`.

## 6. Env files

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`env.sh.template` unsets each variable it owns, drops the `httpsAuth` export, and adds `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD`. Removed the unused `USER_BASIC_AUTH_TEST1` export from this checkout's `env.sh`. No other line in that file changed.

## 7. Module paths

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`jsconfig.json` is `es2024` / `nodenext` with `~/*` and `page-objects/*`. Removed the `components` alias from `package.json`. Five page objects import `browser` from `@wdio/globals`.

## 8. Defra ID tags

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Scenarios carry `@defra-id-stub` and/or `@defra-id-real` from the `@env_*` tags they already had. Scenario text is unchanged. `defra-id.js` follows a single one of those tags. The compatibility feature is also tagged `@compatibility`, and the user-pool branch follows that tag instead of `@browserstack`.

A scenario tagged with both login tags follows `CUCUMBER_EXTRA_TAGS` when that chooses one. When the run does not choose, dev, local, and perf-test stay on the stub. Section 42 removes that environment fallback.

## 9. Ext-test relogin

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`loginToPortalViaStub` calls `loginThroughBasicAuthIfPresented` after it opens the home page.

## 10. Clean browser

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`beforeScenario` skips `reloadSession()` on the first scenario of a worker. Later scenarios reload. A relogin inside a scenario still reloads.

## 11. Screenshots

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`afterStep` and `afterScenario` take a screenshot only when the step or scenario failed. The `FAILED` file and `entrypoint.sh` are unchanged.

## 12. Editor path for `page-objects/page`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`jsconfig.json` maps `page-objects/*` to `./test/page-objects/*.js`. `baseUrl` did not make `nodenext` resolve the extensionless import. The `package.json` alias stays extensionless for the test runner.

## 13. Editor globals, no TypeScript source

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

The suite stays JavaScript with JSDoc. No `.ts` or `.d.ts` files. `jsconfig.json` `types` includes `node` and `@wdio/globals/types`, so `$`, `$$`, `browser`, and `expect` typecheck without an import. Do not install `@types/jquery`.

## 14. JSDoc links, not copied shapes

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`test/types/globals.js` names `CucumberWorld` and is an ES module so another file can `import()` it. A field links to a type that already exists. It is not copied into a new `@typedef {Object}`. `@returns` sits on the getter that owns the value. The rule is `.cursor/rules/jsdoc-types.mdc`.

## 15. World env bag removed

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Removed `cucumberWorld.env = process.env`. Steps that read `this.env` call the matching `TestConfig` getter. `ApiFactory.create` no longer takes an env argument. Support JSON stays on `this.testConfig`.

## 16. Step `this` is `CucumberWorld`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Added `test/step-definitions/cucumber.js`, re-exporting `Given`, `When`, and `Then` with `this` typed as `CucumberWorld`, including the `{ timeout }` form. Step files imported that wrapper. The world `testConfig` at this point was the support JSON, and the imported singleton still owned the env getters. Section 17 removes the wrapper.

## 17. Cucumber `World`, not a custom step function

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Removed `test/step-definitions/cucumber.js`. Steps import `Given`, `When`, and `Then` from `@wdio/cucumber-framework` again. `navigation.js` and `page-components.js` import them from `@cucumber/cucumber`.

Added `test/support/world.js`: `CustomWorld extends World`, registered with `setWorldConstructor`. The driver configs loaded it before the step definitions. `test/types/globals.js` was removed so the class was the only world type. Step callbacks used `@this`. Section 18 removes this world.

## 18. Custom world removed

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Removed `test/support/world.js`, `setWorldConstructor`, and the `@this` tags on step functions. `test/types/globals.js` is the scenario type again. Hooks annotate the world parameter as `CucumberWorld`.

## 19. `CucumberWorld` is Cucumber's `World`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`CucumberWorld` is `import('@cucumber/cucumber').World` intersected with `ScenarioFields`. The index signature on `World` does not wipe `apis` or `testConfig`. Step callbacks use `@this {import('../types/globals.js').CucumberWorld}`. `Given`, `When`, and `Then` stay the framework functions.

## 20. World `testConfig` is the class

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`CucumberWorld.testConfig` is the `TestConfig` instance. Support-file values are getters on that class. `loadSupport()` reads the environment file. `ADMIN_UI_BASE_URL` still replaces `adminUiBaseUrl` when set. The `SupportConfig` typedef is gone. Section 21 splits the support file back off the class.

## 21. `TestConfig` is env vars only

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Support-file values are not getters on `TestConfig`. `loadSupportConfig()` returns `SupportConfig`, and `beforeScenario` stores that on the world. `ADMIN_UI_BASE_URL` still replaces `adminUiBaseUrl` on that object when set. The class reads `process.env` only.

## 22. Scenario values live on `TestMemory`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Added `test/setup/test-memory.js` for the values passed between steps. `test/types/globals.js` names `TestMemory` and `TestConfig` at the same level. `CucumberWorld` is Cucumber's `World` intersected with both. Steps still read and write `this`. There is no `setWorldConstructor`. This replaces the `ScenarioFields` list in `globals.js`.

## 23. No `SupportConfig`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Removed the empty `@typedef {Object} TestConfig`, so the import is the class. `beforeScenario` sets `this.testConfig` to the `TestConfig` instance and `this.support` to the loaded support file.

## 24. Support file loads in the `TestConfig` constructor

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`new TestConfig(prefix)` reads `test/support/<prefix>.config.json` into a private field. Support values are getters. A missing key is logged and thrown, which fails the test. `frontendBaseUrl` and `browserProxyHost` are methods. A shared instance at the bottom of the module uses `<ENVIRONMENT>` or `<ENVIRONMENT>.zap` when `PROXY_MODE` is `zap`. This replaces the untyped `this.support` object. Section 31 removes the shared instance.

## 25. Readability over efficiency

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Added `.cursor/rules/qa-pack.mdc`. This repository is a QA pack. Prefer a clear name and a straight sequence. Do not add a cache, a pool, or a compressed helper whose only purpose is to save work at runtime.

## 26. `adminUiBaseUrl` comes from the support file

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`ADMIN_UI_BASE_URL` no longer replaces `adminUiBaseUrl`. The getter reads the support JSON.

## 27. Frontend URL comes from the support file

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`frontendBaseUrl` is a support-file value, one per environment. The class no longer builds it from `ENVIRONMENT`. Section 33 removes this value.

## 28. Proxy follows the API UAT pack

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`HTTP_PROXY` is the one URL. `off` ignores it. `cdp` and `zap` send the browser through it. Proxied API calls trust the proxy certificate. BrowserStack Local reads the host and port from that URL. This replaces `browserProxyHost`, which only returned the host. Section 29 splits BrowserStack out of "the browser".

## 29. Which traffic uses `HTTP_PROXY`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`zap` sends the sidecar, local Chrome, the grid, and the service API clients through ZAP. The ZAP REST client does not go back through the proxy. `cdp` sends Cognito, GOV.UK Pay, and those same browsers through the platform proxy, and leaves in-platform service calls direct. BrowserStack's remote browser is not given the proxy. The runner uses `HTTP_PROXY` to reach BrowserStack.

## 30. Test user lists stay in `test.config.json`

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Secrets stay out of the support JSON. The Gov.UK and Government Gateway lists are support values, and `onPrepare` reads them from `test.config.json`. The config rule had said not to copy user pools into the JSON.

## 31. The WebdriverIO config chooses the support file

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`TestConfig` no longer builds an instance when the module loads. Each driver config chooses the prefix: `ENVIRONMENT`, or `<environment>.zap` when `PROXY_MODE` is `zap`. Hooks put that instance on the world. Steps and API clients receive it from there.

## 32. Env vars and the support file are separate classes

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`TestEnv` reads `process.env`. `TestConfig` reads one support file. Each WebdriverIO config uses `testEnv.environment` and `testEnv.proxyMode` to choose the file prefix, then constructs `TestConfig`. Hooks put `this.testEnv` and `this.testConfig` on the world. This splits the env getters off `TestConfig`.

## 33. One frontend URL

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

The browser base URL and the organisation frontend API client both read `wasteOrganisationFrontendBaseUrl`. `frontendBaseUrl` is gone from the class and from the support files.

## 34. The three classes stay side by side

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`TestMemory` no longer holds `testEnv` or `testConfig`. `CucumberWorld` is Cucumber's world intersected with `TestMemory`, `TestEnv`, and `TestConfig`. Hooks copy the env and support getters onto the world, so a step reads `this.environment` and `this.defraIdServiceUrl`. Section 35 removes those copied getters.

## 35. Each class keeps its own property

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

A scenario has `testMemory`, `testEnv`, and `testConfig`. Hooks store the env instance, the support-file instance, and a new `TestMemory`. Steps read `this.testEnv.environment`, `this.testConfig.defraIdServiceUrl`, and `this.testMemory.pageName`. A support getter still runs on the `TestConfig` instance.

## 36. A typed Given, When, and Then

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`test/support/steps.js` exports the framework `Given`, `When`, and `Then` with the JSDoc `this` set to `CucumberWorld`, including `{ timeout }`. No step file imports it yet. This replaces an `@this` comment on each step callback.

## 37. The step functions call the framework

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`Given`, `When`, and `Then` in `test/support/steps.js` call the framework functions with the same arguments. The step parameter's `this` is `CucumberWorld`. The typedef that only retyped the original functions is gone. Section 38 removes these wrapper functions.

## 38. The wrapper was the heavier file

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`test/support/steps.js` again exports the framework `Given`, `When`, and `Then` with the `DefineWorldStep` typedef. The functions that branched and called `baseGiven` are gone. Do not import it until a step file is switched.

## 39. Local Chrome against dev

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Ran `wdio.local.conf.js` against dev, sourcing `env.sh`, spec `CookiesInformation.feature`. `ENVIRONMENT` was `dev`. Proxy unset, so the mode stayed `off`. The `@env_dev` filter kept two scenarios. Both passed on Chrome 156.

`allure-results` and `reports` were owned by `nobody` and were removed so the worker could write them. Removed `test/step-definitions/custom-world-example.js` because it imported the missing `customWorld.js` and stopped the worker. The command still exits 1 after a passing spec: `openAllureReport` needs Java, and this host has none. The scenarios themselves passed.

## 40. How scripts and the zap report

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

The npm scripts name the driver. The caller passes the what with `CUCUMBER_EXTRA_TAGS`, ANDed with `@env_*`. `test:integration` still defaults to `not @smoke` when the variable is unset.

Removed `test:smoke`, `test:debug`, `test:local:debug`, and `test:browserstack:regression`. No scenario is tagged `@debug`. `DEBUG=true` is the inspector and debug log. One feature is `--spec`.

`test:zap` is back as one local Chrome script. It runs `AnalyseZapReport.feature` with `@zap`, which replaces the env tag, and that scenario attaches the saved ZAP files to Allure. Section 5 had removed `test:zap`. Section 41 moves this run back to the sidecar.

## 41. The zap scenario stays on the sidecar

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`test:zap` runs `AnalyseZapReport.feature` with `wdio.conf.js`. It sets `ENVIRONMENT=local` and `CUCUMBER_EXTRA_TAGS='@zap'`, so the filter stays `@env_local and (@zap)`. GitHub CI is that run: Compose Chrome on port 4444, and no `env.sh`. `test:zap:local` sources `env.sh` and calls the same script. Section 42 moves this run to the grid and stops setting `ENVIRONMENT`.

## 42. Driver and suite runners

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`CUCUMBER_EXTRA_TAGS` is the whole Cucumber tag expression. `@env_*` is no longer ANDed in, and those tags are off the feature files. `defraIdServiceUrl` is the stub host or real Defra ID. A stub run pointed at real Defra ID is a config error.

`scenarioUsesDefraIdStub` no longer reads `ENVIRONMENT`. One login tag wins. Both tags follow `CUCUMBER_EXTRA_TAGS`, and the step throws when that does not choose one. This removes the dev, local, and perf-test stub fallback in section 8. Admin and `AnalyseZapReport` have no login tag. Two service-charge outlines still have no scenario login tag. Their example rows keep the tag.

`wdio.conf.js` is the one remote Chrome config for a laptop, CDP, and GitHub. Host is `GRID_HOST`, then `CHROMEDRIVER_URL`, then `127.0.0.1`. Port is `GRID_PORT`, then `CHROMEDRIVER_PORT`, then `4444`. `connectionRetryTimeout` is 120000. It keeps the sidecar Chrome arguments, the detailed spec reporter, and the `FAILED` file. It does not open Allure. `wdio.local.grid.conf.js` is gone. Local Chrome keeps 60000 and still opens Allure.

Each of `test:local`, `test:browserstack`, and `test:grid` has `regression:defra-id-stub`, `regression:defra-id-real`, `smoke`, and `debug`. A script sources `env.sh` only when the file is present. `test:integration` stays `not @smoke` on the grid. `test:zap` is the grid with `@zap` and does not set `ENVIRONMENT`. Removed `test:browserstack:local`, `test:browserstack:local:admin-tool`, `test:local:grid`, `test:local:grid:admin-tool`, and `test:zap:local`.

## 43. env:test sources env.sh

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

The test scripts no longer source `env.sh`. `npm run env:test -- <script>` sources that file, then runs the named script. Extra arguments after another `--` are passed through. CDP and GitHub call the test script directly. Section 45 removes `env:test`.

## 44. Named grid config and suite runners only

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

`wdio.conf.js` is now `wdio.grid.conf.js`. Page objects import that file. Removed the unfiltered `test:local`, `test:grid`, and `test:browserstack` scripts, and `test:integration`. `npm test` is `test:${PROFILE}`. `PROFILE` is the runner after `test:`, for example `grid:smoke`.

Admin is a suite on each driver: `test:local:admin-ui`, `test:grid:admin-ui`, and `test:browserstack:admin-ui`. The BrowserStack one still sets `BROWSERSTACK_DESKTOP_ONLY`. Removed `test:local-admin-ui`, `test:admin-tool`, and `test:browserstack:admin-tool`. The admin UI CI calls `test:grid:admin-ui`.

## 45. PROFILE and source:clean:test:report

Lewis Magri, 2026-11-02 14:45 UTC, on 56b46ea6e095

Removed `env:test`. A laptop sets `PROFILE` and runs `source:clean:test:report`, which sources `env.sh` and then runs `npm test`. CDP and GitHub set `PROFILE` and call `npm test`. A single feature is still `--spec` on the debug script.

## 46. Compatibility is a BrowserStack script

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`wdio.browserstack.conf.js` no longer reads `@compatibility` from `CUCUMBER_EXTRA_TAGS` to choose browsers. `test:browserstack:compatibility` sets `BROWSERSTACK_COMPATIBILITY` and `CUCUMBER_EXTRA_TAGS='@compatibility'`. That flag selects the multi-browser list. Ext-test stays on one browser. There is no local or grid compatibility script. Outside ext-test, that run takes the login user from `availableUsers`. Section 47 removes the flag.

## 47. Compatibility stays on the extra tags

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

Removed `BROWSERSTACK_COMPATIBILITY`. `test:browserstack:compatibility` sets `CUCUMBER_EXTRA_TAGS` to `@compatibility`. `wdio.browserstack.conf.js` and the generic login step both use `cucumberExtraTags.includes('@compatibility')`.

## 48. WebdriverIO hooks live on the driver config

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

Removed `createHooks` from `test/setup/hooks.js`. `wdio.grid.conf.js`, `wdio.local.conf.js`, and `wdio.browserstack.conf.js` each define `beforeScenario`, `afterStep`, `afterScenario`, `onPrepare`, and `onComplete`. Shared steps live in `test/setup/wdio-shared.js`.

The `ENVIRONMENT === 'test'` pool seed stays in each `onPrepare`. BrowserStack's `availableUsers` seed and return stay in that config. The grid writes `FAILED` and the accessibility index. BrowserStack writes `FAILED`. Local Chrome publishes the ZAP report and opens Allure, and does not write `FAILED`.

## 49. BrowserStack does not run through ZAP

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`wdio.browserstack.conf.js` throws when `PROXY_MODE` is `zap`. It loads `<environment>.config.json` and does not open or publish a ZAP session. `cdp` still uses `HTTP_PROXY` for the Node client and BrowserStack Local. The grid and local Chrome still open the ZAP session.

## 50. One support-file prefix for the grid and local Chrome

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`supportFilePrefix` in `test/setup/wdio-shared.js` chooses `<environment>` or `<environment>.zap`. The grid and local Chrome both call it. BrowserStack still loads `<environment>.config.json` itself. Section 51 moves that choice into `TestConfig`.

## 51. TestConfig chooses the support file

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`TestConfig` takes the environment and `proxyMode`. `zap` loads `test/support/<environment>.zap.config.json`. Any other mode loads `<environment>.config.json`. A missing environment throws. The user-pool seed passes `test` with no proxy mode, so it reads `test.config.json`. `supportFilePrefix` is gone.

## 52. TestConfig reads ENVIRONMENT itself

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`TestConfig` takes `proxyMode` only and reads `ENVIRONMENT` through `TestEnv`. `zap` still loads `<environment>.zap.config.json`. The user-pool seed passes no proxy mode and only runs when `ENVIRONMENT` is `test`. Section 53 stops the `TestEnv` import.

## 53. TestConfig reads ENVIRONMENT from the process

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`TestConfig` no longer imports `TestEnv`. The constructor reads `process.env.ENVIRONMENT` and still takes `proxyMode` to choose the `.zap` file.

## 54. TestConfig takes the prefix and the proxy mode

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

The constructor arguments are the support-file prefix and `proxyMode`. `zap` appends `.zap` to that prefix. The three driver configs pass `testEnv.environment` and `testEnv.proxyMode`. The user-pool seed passes `test` and no proxy mode. This stops the constructor reading `ENVIRONMENT` itself.

## 55. TestConfig does not check the prefix

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

The constructor no longer throws when the prefix is missing. It uses the prefix it was given.

## 56. Completed work lives with the log

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

Moved `ai-revision-log.md` from the repo root into `ai-completed-tasks/`. Added `ai-completed-tasks/test-framework.md` for the suite after sections 1 to 55. `test-framework-refactor-plan.md` stays frozen. Section 57 moves these again.

## 57. Todo and done folders

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

The refactor task is done. Moved `test-framework-refactor-plan.md` to `done/`. `done/test-framework.md` stays the account of the suite. Open work moved to `todo/`: the user-pool gap, BrowserStack from GitHub, and the missing CDP screenshot. Removed `ai-completed-tasks/`. This log is back at the repo root. Section 58 moves the three into `changes/`.

## 58. One changes folder

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`todo/`, `done/`, and `ai-revision-log.md` live in `changes/`.

## 59. The report does not wait for screenshots

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

`changes/todo/cdp-screenshots.md` says the Allure report is generated and published whether or not a screenshot exists. The open work is why a screenshot taken on CDP does not appear in that report. The note also said not to synthesise results for a worker that wrote none. Section 60 removes that sentence.

## 60. The report is always published

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

The Allure report is always generated and published after the run. The open work in `changes/todo/cdp-screenshots.md` stays why a screenshot taken on CDP does not appear in that report.

## 61. CDP screenshots are not an open gap

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

A check of the published report did not show failure screenshots missing. Moved `changes/todo/cdp-screenshots.md` to `changes/done/cdp-screenshots.md`. The Allure report is still always generated and published after the run.

## 62. The screenshot note is deleted

Lewis Magri, 2026-11-03, on cd12b0e9dd4b

Deleted `changes/done/cdp-screenshots.md`. There is no open or finished note for it.

## 63. Each entry names the author, the time, and the base commit

Lewis Magri, 2026-11-03 14:16 UTC, on cd12b0e9dd4b

A topic summary of this log had grouped the decisions and dropped the order, including the files that were added and then removed. Sections 1 to 62 are that sequence again, shortened to the concrete change. From this section on, each entry records `git config --global user.name`, `date -u`, and `git rev-parse --short=12 HEAD`.

Covers: `.cursor/rules/todo-done-log.mdc`.

## 64. BrowserStack is not stopped for ZAP

Lewis Magri, 2026-11-03 14:38 UTC, on cd12b0e9dd4b

Removed the `PROXY_MODE=zap` throw from `wdio.browserstack.conf.js`. BrowserStack passes `testEnv.environment` and `testEnv.proxyMode` to `TestConfig`, the same as the grid and local Chrome, so `zap` loads `<prefix>.zap`. The remote browser is still not given `HTTP_PROXY`. The runner still uses that URL to reach BrowserStack when the mode is not `off`.

Covers: `.cursor/rules/config-and-paths.mdc`, `.cursor/rules/proxy-sessions-report.mdc`. Section 49 added the throw.
