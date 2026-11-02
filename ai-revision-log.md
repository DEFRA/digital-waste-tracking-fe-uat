# AI revision log

The spec is `test-framework-refactor-plan.md`. That file is frozen. Each entry records what changed, why, and which part of the spec it covers. If a decision moves, the move is recorded here.

## 1. Revision log

Created this file so later changes are appended here instead of edited into the spec.

## 2. Cursor rules

Added `.cursor/rules/test-framework.mdc`, `proxy-sessions-report.mdc`, `config-and-paths.mdc`, and `local-npm.mdc`. They state the decisions a later chat should follow, including where / how / what, the frozen spec, and how this machine runs npm.

Covers: Cursor rules, Running npm on this machine.

## 3. Notes

Rewrote the four WebdriverIO configs without the scaffold comments. The reasons those comments carried (proxy, session timeout, the `FAILED` file, why dev and test differ) are in the Cursor rules.

Covers: Notes.

## 4. Setup folder

Added `test/setup/` and pointed all four driver configs at it.

- `test-config.js` loads the support JSON and exposes env vars as getters. Secret values stay in the environment. `local` uses the Compose host for every driver.
- `ApiFactory` reads `PROXY_MODE`. `cdp` proxies Cognito and GOV.UK Pay. `zap` proxies the other service clients as well. The ZAP client is not sent back through the proxy. `xapikey` still rewrites the two backend URLs.
- Hooks are shared. Each driver file keeps its own capabilities, host, and services. Timeouts stay per how. `MAX_INSTANCES` defaults to 1.
- `onPrepare` still fills the test-environment user pools, and on BrowserStack the combined `availableUsers` pool. It opens a ZAP session when the mode is `zap`.
- `onComplete` still writes `FAILED` for the sidecar and BrowserStack, and still builds the accessibility index for the sidecar. Local Chrome and the grid still open the Allure report.

Decision moves:

- Unset `PROXY_MODE` means `cdp` when `HTTP_PROXY` is set, and `off` when it is not. A value other than `off`, `cdp`, or `zap` throws. This keeps current Portal egress and local runs that do not set the variable.
- Local Chrome and the grid now expire stub users with `defraIdStubAPI.expireUser`, the same call the sidecar and BrowserStack already used.
- A zap-mode run writes `zap-report/` from `onComplete`. `AnalyseZapReport.feature` reads those files when the mode is `off`.

Covers: Setup folder and config manager, Parallel instances, Proxy, Hooks that must keep working.

## 5. Scripts

`npm test` / `PROFILE` is unchanged. `test:browserstack` no longer sources `env.sh` and no longer forces `@smoke`. `test:browserstack:local` sources `env.sh` and uses the same config. `test:browserstack:regression` no longer forces `not @smoke`. Removed `test:zap`, `test:github`, and `test:github:browserstack`. Admin-tool specs can run on the sidecar, local Chrome, the grid, and BrowserStack. `BROWSERSTACK_DESKTOP_ONLY` stays on the BrowserStack admin-tool scripts. `@compatibility` selects the multi-browser BrowserStack list. The README no longer documents the missing GitHub configs.

`compose.yml` starts ZAP on port 8080. The journey-test workflow sets `HTTP_PROXY`, `PROXY_MODE=zap`, and `ZAP_API_KEY` for the scan. The template action checks out its own repository, so this workflow cannot run this suite's gate as a second step. The gate remains `AnalyseZapReport.feature` with `PROXY_MODE=off`.

Covers: Four ways of running, plus BrowserStack. Proxy.

## 6. Env files

`env.sh.template` unsets each variable it owns, drops the `httpsAuth` export, and adds `BASIC_AUTH_USERNAME` and `BASIC_AUTH_PASSWORD`. Removed the unused `USER_BASIC_AUTH_TEST1` export from this checkout's `env.sh`. No other line in that file changed.

Covers: Env files.

## 7. Module paths

`jsconfig.json` is `es2024` / `nodenext` with `~/*` and `page-objects/*`. Removed the `components` alias from `package.json`. The five page objects import `browser` from `@wdio/globals`.

Covers: Module paths.

## 8. Defra ID tags

Scenarios now carry `@defra-id-stub` and/or `@defra-id-real` from the `@env_*` tags they already had. Scenario text is unchanged. `defra-id.js` follows a single one of those tags. The compatibility feature is also tagged `@compatibility`, and the user-pool branch follows that tag instead of `@browserstack`.

Decision move: a scenario tagged with both `@defra-id-stub` and `@defra-id-real` follows `CUCUMBER_EXTRA_TAGS` when that chooses one of them. When the run does not choose, dev, local, and perf-test stay on the stub so current `@env_*` runs keep the same journey.

Covers: Defra ID stub versus the real service.

## 9. Ext-test relogin

`loginToPortalViaStub` calls the existing `loginThroughBasicAuthIfPresented` after it opens the home page.

Covers: Env files, the relogin gap.

## 10. Clean browser

`beforeScenario` skips `reloadSession()` on the first scenario of a worker. Later scenarios still reload. A relogin inside a scenario still reloads.

Covers: Clean browser between tests.

## 11. Screenshots

`afterStep` and `afterScenario` take a screenshot only when the step or scenario failed. The `FAILED` file and `entrypoint.sh` are unchanged.

Covers: Report.

## 12. Editor path for `page-objects/page`

`nodenext` does not resolve `page-objects/*` → `./test/page-objects/*`. Adding `baseUrl` does not fix it. The editor path now maps `page-objects/*` to `./test/page-objects/*.js`, so `import { Page } from 'page-objects/page'` typechecks. The `package.json` alias is unchanged, so the test runner still loads the extensionless import.

Covers: Module paths. Decision move: the mapped file includes `.js` because that is what makes the editor resolve the existing import.

## 13. Editor globals, no TypeScript source

The suite stays vanilla JavaScript with JSDoc. No `.ts` or `.d.ts` files.

`jsconfig.json` `types` now includes `node` and `@wdio/globals/types`. That is the existing WebdriverIO global declaration, so the editor knows `$`, `$$`, `browser`, and `expect` in page objects that call them without an import. `@wdio/allure-reporter` and `@wdio/shared-store-service` already resolve to their package types. Do not install `@types/jquery`.

Covers: Module paths. Decision move: the editor loads `@wdio/globals/types` so those globals typecheck without rewriting page objects and without adding TypeScript.

## 14. JSDoc links, not copied shapes

Types stay in JavaScript. `test/types/globals.js` is the shared `CucumberWorld` type and is an ES module so hooks can `import()` it. A field that already has a class or exported typedef links to that type. It is not copied into another `@typedef {Object}`. `@returns` sits on the owning getter, so command-click opens the method. The rule is `.cursor/rules/jsdoc-types.mdc`.

Covers: Editor globals, no TypeScript source. Decision move: `TestConfig` getters own their return types, and the world links to the class instead of a support-JSON property list.

## 15. World env bag removed

`cucumberWorld.env = process.env` was only a copy of the process environment. Steps that read `this.env` now call the matching `TestConfig` getter. `ApiFactory.create` no longer takes an env argument. Support JSON stays on `this.testConfig`.

Covers: Setup folder and config manager. Decision move: step definitions do not read `this.env`.

## 16. Step `this` is `CucumberWorld`

`Given`, `When`, and `Then` are generic, and an unannotated `async function` made `this` the function itself. `test/step-definitions/cucumber.js` re-exports them with `this` typed as `CucumberWorld`, including the `{ timeout }` form. Step files import that wrapper. `navigation.js` and `page-components.js` used `@cucumber/cucumber` and now use the same wrapper.

`this.testConfig` is the support JSON. `loadSupportConfig` owns `SupportConfig`. The imported `testConfig` singleton still owns env getters.

Covers: Editor globals, no TypeScript source. Decision move: section 14 linked the world `testConfig` property to the `TestConfig` class. That class is the singleton. The world value is the support JSON.

## 17. Cucumber `World`, not a custom step function

Removed `test/step-definitions/cucumber.js`. Steps import `Given`, `When`, and `Then` from `@wdio/cucumber-framework` again. `navigation.js` and `page-components.js` import them from `@cucumber/cucumber`, as they did before.

`test/support/world.js` is Cucumber's custom world: `CustomWorld extends World`, registered with `setWorldConstructor`. The four driver configs load that file before the step definitions. Cucumber's own TypeScript docs still require the step callback to name that world, `function (this: CustomWorld)`. The JavaScript form is `@this` on the step function. `test/types/globals.js` is gone so the class is the only world type.

Covers: Editor globals, no TypeScript source. Decision move: do not wrap Cucumber's step functions.

## 18. Custom world removed

Removed `test/support/world.js`, `setWorldConstructor`, and the `@this` tags on step functions. Step definitions are back to Cucumber's `Given`, `When`, and `Then` with no world annotation. `test/types/globals.js` is the scenario type again. Hooks annotate the world parameter as `CucumberWorld`.

Covers: Editor globals, no TypeScript source. Decision move: do not register a custom Cucumber world, and do not edit step definitions to type `this`.

## 19. `CucumberWorld` is Cucumber's `World`

`CucumberWorld` is `import('@cucumber/cucumber').World` intersected with `ScenarioFields`. The `[key: string]: any` index on `World` does not wipe `apis` or `testConfig`. Step callbacks use `@this {import('../types/globals.js').CucumberWorld}`. `Given`, `When`, and `Then` stay the framework functions.

Covers: Editor globals, no TypeScript source. Decision move: section 18 left step callbacks untyped. The `@this` tag is how this JavaScript names Cucumber's world.

## 20. World `testConfig` is the class

`CucumberWorld.testConfig` is the `TestConfig` instance. Support-file values are getters on that class. `loadSupport()` reads the environment file, and `ADMIN_UI_BASE_URL` still replaces `adminUiBaseUrl` when set. The `SupportConfig` typedef is gone.

Covers: Setup folder and config manager. Decision move: section 16 kept the world value as the support JSON.

## 21. `TestConfig` is env vars only

Support-file values are not getters on `TestConfig`. `loadSupportConfig()` returns `SupportConfig`, and `beforeScenario` stores that on the world. `ADMIN_UI_BASE_URL` still replaces `adminUiBaseUrl` on that object when set. The class reads `process.env` only.

Covers: Setup folder and config manager. Decision move: section 20 put the support file on the class.

## 22. Scenario values live on `TestMemory`

`test/setup/test-memory.js` is the class that lists the values passed between steps. `test/types/globals.js` names `TestMemory` and `TestConfig` at the same level. `CucumberWorld` is Cucumber's `World` intersected with both. Steps still read and write `this`. There is no `setWorldConstructor`.

Covers: Editor globals, no TypeScript source. Decision move: section 19 kept the field list on `ScenarioFields` in `globals.js`.

## 23. No `SupportConfig`

`TestConfig` is only the class. The empty `@typedef {Object} TestConfig` is gone, so `import('../setup/test-config.js').TestConfig` is that class. `beforeScenario` sets `this.testConfig` to the `TestConfig` instance and `this.support` to the loaded support file. There is no second config type.

Covers: Setup folder and config manager. Decision move: section 21 kept a `SupportConfig` typedef for the support file.

## 24. Support file loads in the `TestConfig` constructor

`new TestConfig(prefix)` reads `test/support/<prefix>.config.json` into a private field. Support values are getters on that instance. A missing key is logged and thrown, which fails the running test. `frontendBaseUrl` and `browserProxyHost` are methods on the class. The shared instance uses `<ENVIRONMENT>` or `<ENVIRONMENT>.zap` when `PROXY_MODE` is `zap`.

Covers: Setup folder and config manager. Decision move: section 23 kept the support file as an untyped `this.support` object.

## 25. Readability over efficiency

This repository is a QA pack, not a running service. The rule is `.cursor/rules/qa-pack.mdc`.

Covers: Editor globals, no TypeScript source.

## 26. `adminUiBaseUrl` comes from the support file

`ADMIN_UI_BASE_URL` no longer replaces `adminUiBaseUrl`. The getter reads the support JSON.

Covers: Setup folder and config manager. Decision move: the refactor spec kept an environment override for `adminUiBaseUrl`.

## 27. Frontend URL comes from the support file

`frontendBaseUrl` is a support-file value, one per environment. The class no longer builds it from `ENVIRONMENT`.

Covers: Setup folder and config manager. Decision move: section 24 kept `frontendBaseUrl` as a method that chose the URL in code.

## 28. Proxy follows the API UAT pack

`HTTP_PROXY` stays the one URL. `off` ignores it. `cdp` and `zap` send the browser through it. Proxied API calls trust the proxy certificate. BrowserStack Local reads the host and port from that URL.

Covers: Proxy, sessions, and reports. Decision move: section 24 kept a `browserProxyHost` helper that only returned the host.

## 29. Which traffic uses `HTTP_PROXY`

`zap` sends the sidecar, local Chrome, the grid, and the service API clients through ZAP. The ZAP REST client does not go back through the proxy. `cdp` sends Cognito, GOV.UK Pay, and those same browsers through the platform proxy, and leaves in-platform service calls direct. BrowserStack's remote browser is not given the proxy. The runner uses `HTTP_PROXY` to reach BrowserStack.

Covers: Proxy, sessions, and reports. Decision move: section 28 said `cdp` and `zap` both send the browser through the proxy, without the BrowserStack exception.

## 30. Test user lists stay in `test.config.json`

Secrets stay out of the support JSON. The Gov.UK and Government Gateway lists are support values, and `onPrepare` reads them from `test.config.json`.

Covers: Setup folder and config manager. Decision move: the config rule had said not to copy user pools into the JSON.

## 31. The WebdriverIO config chooses the support file

`TestConfig` no longer builds an instance when the module loads. Each driver config chooses the prefix: `ENVIRONMENT`, or `<environment>.zap` when `PROXY_MODE` is `zap`. Hooks put that instance on the world. Steps and API clients receive it from there.

Covers: Setup folder and config manager. Decision move: section 24 kept a shared instance at the bottom of `test-config.js`.

## 32. Env vars and the support file are separate classes

`TestEnv` reads `process.env`. `TestConfig` reads one support file. Each WebdriverIO config uses `testEnv.environment` and `testEnv.proxyMode` to choose the file prefix, then constructs `TestConfig`. `CucumberWorld` includes both classes. Hooks put `this.testEnv` and `this.testConfig` on the world.

Covers: Setup folder and config manager. Decision move: section 24 kept env getters and support getters on one class.

## 33. One frontend URL

The browser base URL and the organisation frontend API client both read `wasteOrganisationFrontendBaseUrl`. `frontendBaseUrl` is gone from the class and from the support files.

Covers: Setup folder and config manager. Decision move: section 27 kept a separate `frontendBaseUrl` value.

## 34. The three classes stay side by side

`TestMemory` no longer holds `testEnv` or `testConfig`. `CucumberWorld` is Cucumber's world intersected with `TestMemory`, `TestEnv`, and `TestConfig`. Hooks copy the env and support getters onto the world. A step reads `this.environment` and `this.defraIdServiceUrl`.

Covers: Editor globals, no TypeScript source. Decision move: section 32 kept the two instances as fields on `TestMemory`.

## 35. Each class keeps its own property

`CucumberWorld` is no longer the three classes merged onto the world. A scenario has `testMemory`, `testEnv`, and `testConfig`. Hooks store the env instance, the support-file instance, and a new `TestMemory`. Steps read `this.testEnv.environment`, `this.testConfig.defraIdServiceUrl`, and `this.testMemory.pageName`. The copied getters are gone, so a support getter still runs on the `TestConfig` instance.

Covers: Editor globals, no TypeScript source. Decision move: section 34 merged the three classes onto the world.

## 36. A typed Given, When, and Then

`test/support/steps.js` exports the framework `Given`, `When`, and `Then`. The only addition is the JSDoc `this` on the step function, set to `CucumberWorld`. Both call shapes are kept, including `{ timeout }`. No step file imports it yet.

Covers: Editor globals, no TypeScript source. Decision move: section 34 kept the `@this` comment on each step callback.

## 37. The step functions call the framework

`Given`, `When`, and `Then` in `test/support/steps.js` call the framework functions with the same arguments. The step parameter's `this` is `CucumberWorld`. The typedef that only retyped the original functions is gone.

Covers: Editor globals, no TypeScript source. Decision move: section 36 kept the framework functions and hung a typedef on them.

## 38. The wrapper was the heavier file

`test/support/steps.js` again exports the framework `Given`, `When`, and `Then` with the `DefineWorldStep` typedef. The functions that branched and called `baseGiven` are gone.

Covers: Editor globals, no TypeScript source. Decision move: section 37 wrapped the three functions.

## 39. Local Chrome against dev

Ran `wdio.local.conf.js` on this machine against dev, sourcing `env.sh` and limiting the spec to `CookiesInformation.feature`. `ENVIRONMENT` was `dev`. `HTTP_PROXY` and `PROXY_MODE` were unset, so the proxy stayed off. The `@env_dev` filter kept two scenarios. Both passed: the unauthenticated cookies journey and the Defra ID stub login, 8 steps in 5.2s on Chrome 156.

The worker could not start until two local blockers were cleared. `allure-results` and `reports` were owned by `nobody` and not writable, so they were removed. `test/step-definitions/custom-world-example.js` imported the missing `customWorld.js` and stopped the worker before any scenario, so that example file was removed.

The command still exits 1 after a passing spec. `onComplete` in `wdio.local.conf.js` calls `openAllureReport`, and this host has no Java, so Allure generate fails. The scenarios themselves passed.

Covers: Four ways of running. The full `@env_dev` pack is the same command without `--spec`.

## 40. How scripts and the zap report

The npm scripts name the driver. The caller passes the what with `CUCUMBER_EXTRA_TAGS`, ANDed with `@env_*`. `@defra-id-stub` and `@defra-id-real` are that what. `test:integration` still defaults to `not @smoke` when the variable is unset, so `npm test` on the Portal is unchanged. A set value replaces that default.

Removed `test:smoke`, `test:debug`, `test:local:debug`, and `test:browserstack:regression`. No scenario is tagged `@debug`, so the sidecar debug script matched nothing. `DEBUG=true` is the local Chrome and grid inspector and debug log. One feature is `--spec` on the how.

`test:zap` is back as one local Chrome script. It runs `AnalyseZapReport.feature` with `@zap`, which replaces the env tag, and that scenario attaches the saved ZAP files to Allure.

Covers: Four ways of running, plus BrowserStack. Proxy. Decision move: section 5 removed `test:zap`, and the plan kept `test:smoke` and `test:debug` as sidecar scripts.

## 41. The zap scenario stays on the sidecar

`test:zap` runs `AnalyseZapReport.feature` with `wdio.conf.js`. It sets `ENVIRONMENT=local` and `CUCUMBER_EXTRA_TAGS='@zap'`, so the filter stays `@env_local and (@zap)`. GitHub CI is that run: Compose Chrome on port 4444, and no `env.sh`. `test:zap:local` sources `env.sh` and calls the same script.

Covers: Proxy. Decision move: section 40 ran that scenario on local Chrome and replaced the env tag.

## 42. Driver and suite runners

`CUCUMBER_EXTRA_TAGS` is the whole Cucumber tag expression. `@env_*` is no longer ANDed in, and those tags are off the feature files. `defraIdServiceUrl` is the stub host or real Defra ID. A stub run pointed at real Defra ID is a config error. Perf-test and dev differ only by their support URLs.

Scenarios keep `@defra-id-stub` and `@defra-id-real` from the environment tags they already had, including a feature-level tag combined with the scenario line. Admin and `AnalyseZapReport` no longer carry a login tag. Two service-charge outlines still have no login tag, so they stay out of both regressions. Their example rows keep the login tag that replaced `@env_dev` or `@env_test`.

`scenarioUsesDefraIdStub` no longer reads `ENVIRONMENT`. One login tag wins. Both tags follow `CUCUMBER_EXTRA_TAGS`, and the step throws when that does not choose one.

`wdio.conf.js` is the one remote Chrome config for a laptop, CDP, and GitHub. Host and port prefer `GRID_HOST` / `GRID_PORT`, then `CHROMEDRIVER_URL` / `CHROMEDRIVER_PORT`. It keeps the 120000 connection retry, the sidecar Chrome arguments, the detailed spec reporter, and the `FAILED` file. It does not open Allure. `wdio.local.grid.conf.js` is gone. Local Chrome still uses a 60000 connection retry and still opens Allure.

Each of `test:local`, `test:browserstack`, and `test:grid` has `regression:defra-id-stub`, `regression:defra-id-real`, `smoke`, and `debug`. A script sources `env.sh` only when the file is present. `test:integration` stays `not @smoke` on the grid. `test:zap` is the grid with `@zap` and does not set `ENVIRONMENT`. Removed `test:browserstack:local`, `test:browserstack:local:admin-tool`, `test:local:grid`, `test:local:grid:admin-tool`, and `test:zap:local`.

Covers: Four ways of running, BrowserStack, proxy. Decision move: sections 40 and 41, and the grid connection retry of 60000.

## 43. env:test sources env.sh

The test scripts no longer source `env.sh`. `npm run env:test -- <script>` sources that file, then runs the named script. Extra arguments after another `--` are passed through, so a debug spec is `npm run env:test -- test:local:debug -- --spec <feature>`. CDP and GitHub call the test script directly, and the Portal image still has no `env.sh`.

Covers: Four ways of running. Decision move: section 42 sourced `env.sh` from each runner when the file was present.

## 44. Named grid config and suite runners only

`wdio.conf.js` is now `wdio.grid.conf.js`. Page objects import that file. Removed the unfiltered `test:local`, `test:grid`, and `test:browserstack` scripts, and `test:integration`. `npm test` is `test:${PROFILE}`, so `PROFILE` is the runner after `test:`, for example `grid:smoke` or `browserstack:regression:defra-id-real`.

Admin is a suite on each driver: `test:local:admin-ui`, `test:grid:admin-ui`, and `test:browserstack:admin-ui`. The BrowserStack one still sets `BROWSERSTACK_DESKTOP_ONLY`. Removed `test:local-admin-ui`, `test:admin-tool`, and `test:browserstack:admin-tool`. The admin UI CI calls `test:grid:admin-ui`.

Covers: Four ways of running, BrowserStack. Decision move: sections 42 and 43 kept unfiltered runners and `wdio.conf.js`. The plan's `PROFILE=browserstack` entry now needs the full runner name.

## 45. PROFILE and source:clean:test:report

Removed `env:test`. A laptop sets `PROFILE` and runs `source:clean:test:report`, which sources `env.sh` and then runs `npm test`. CDP and GitHub set `PROFILE` and call `npm test`. A single feature is still `--spec` on the debug script.

Covers: Four ways of running. Decision move: section 43 added `env:test`.
