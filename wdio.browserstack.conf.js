import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import { initialiseAccessibilityChecking } from './test/utils/accessibility-checking.js'
import fs from 'node:fs'
import { readFileSync } from 'fs'
// import { setResourcePool, addValueToPool } from '@wdio/shared-store-service'
import { ApiFactory } from './test/utils/apis/api-factory.js'

// const debug = process.env.DEBUG
// const oneMinute = 60 * 1000
// const oneHour = 60 * 60 * 1000

/**
 * Enable webdriver.io to use the outbound proxy.
 * This is required for the test suite to be able to talk to BrowserStack.
 */
// if (process.env.HTTP_PROXY) {
const dispatcher = new ProxyAgent({
  // uri: process.env.HTTP_PROXY
  uri: 'http://localhost:3128'
})
setGlobalDispatcher(dispatcher)
bootstrap()
global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
// }

// const oneMinute = 60 * 1000

export const config = {
  //
  // ====================
  // Runner Configuration
  // ====================
  // WebdriverIO supports running e2e tests as well as unit and component tests.
  runner: 'local',
  //
  // Set a base URL in order to shorten url command calls. If your `url` parameter starts
  // with `/`, the base url gets prepended, not including the path portion of your baseUrl.
  // If your `url` parameter starts without a scheme or `/` (like `some/path`), the base url
  // gets prepended directly.
  baseUrl: `https://waste-organisation-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,

  // You will need to provide your own BrowserStack credentials.
  // These should be added as secrets to the test suite.
  user: process.env.BROWSERSTACK_USERNAME,
  key: process.env.BROWSERSTACK_KEY,

  // Tests to run
  // specs: ['./test/specs/**/*.js'],
  specs: ['./test/features/waste-organisation-frontend/ViewAPICode.feature'],

  // Tests to exclude
  exclude: [],
  // maxInstances: 1,

  commonCapabilities: {
    'bstack:options': {
      buildName: `digital-waste-tracking-fe-uat-${process.env.ENVIRONMENT}` // configure as required
    }
  },

  capabilities: [
    {
      browserName: 'Chrome', // Set as required
      'bstack:options': {
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      }
    },
    {
      browserName: 'Chrome',
      'bstack:options': {
        os: 'OS X',
        osVersion: 'Ventura',
        browserVersion: 'latest',
        consoleLogs: 'info'
      }
    }
    // {
    //   browserName: 'Edge',
    //   'bstack:options': {
    //     os: 'Windows',
    //     osVersion: '11',
    //     browserVersion: 'latest'
    //   }
    // }
  ],

  services: [
    'shared-store',
    [
      'browserstack',
      {
        testObservability: true, // Disable if you do not want to use the browserstack test observer functionality
        testObservabilityOptions: {
          user: process.env.BROWSERSTACK_USER,
          key: process.env.BROWSERSTACK_KEY,
          projectName: 'digital-waste-tracking-fe', // should match project in browserstack
          buildName: `digital-waste-tracking-fe-uat-${process.env.ENVIRONMENT}`
        },
        acceptInsecureCerts: true,
        forceLocal: false,
        browserstackLocal: true,
        // **this is only needed for CDP runs and must be disabled for local runs
        opts: {
          binarypath: '/root/.browserstack/BrowserStackLocal',
          verbose: true,
          proxyHost: 'localhost',
          proxyPort: 3128
        }
      }
    ]
  ],

  execArgv: ['--loader', 'esm-module-alias/loader'],

  logLevel: 'info',

  // Number of failures before the test suite bails.
  bail: 0,
  waitforTimeout: 120000,
  waitforInterval: 200,
  connectionRetryTimeout: 6000,
  connectionRetryCount: 3,

  framework: 'cucumber',
  cucumberOpts: {
    timeout: 120000,
    require: ['./test/step-definitions/**/*.js'],
    tags: `@env_${process.env.ENVIRONMENT}`
  },

  reporters: [
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        useCucumberStepReporter: true,
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ],
  //   [
  //     // Spec reporter provides rolling output to the logger so you can see it in-progress
  //     'spec',
  //     {
  //       addConsoleLogs: true,
  //       realtimeReporting: true,
  //       color: false
  //     }
  //   ],
  //   [
  //     // Allure is used to generate the final HTML report
  //     'allure',
  //     {
  //       outputDir: 'allure-results'
  //     }
  //   ]
  // ],

  // Options to be passed to Mocha.
  // See the full list at http://mochajs.org/
  // mochaOpts: {
  //   ui: 'bdd',
  //   timeout: oneMinute
  // },

  // Hooks
  //
  // =====
  // Cucumber Hooks
  // =====
  beforeScenario: async function (world, cucumberWorld) {
    // IMPORTANT: In WebdriverIO, the world object in hooks may not be the same instance
    // as 'this' in step definitions. We need to ensure properties are set on the world object
    // that will be accessible in step definitions.

    // Initialize world object properties here
    // These will be accessible in step definitions via 'this'
    cucumberWorld.pageName = null // Initialize, will be set in step definitions
    cucumberWorld.tags = world.pickle.tags.map((tag) => tag.name).join(', ')
    cucumberWorld.axeBuilder = null
    cucumberWorld.env = process.env

    // Load test configuration from <env>.config.json
    const testConfigData = readFileSync(
      `./test/support/${process.env.ENVIRONMENT}.config.json`,
      'utf8'
    )
    cucumberWorld.testConfig = JSON.parse(testConfigData)
    cucumberWorld.apis = ApiFactory.create(
      cucumberWorld.testConfig.wasteOrganisationBackendServiceUrl,
      cucumberWorld.env.HTTP_PROXY
    )

    if (world.pickle.tags.find((tag) => tag.name === '@accessibility')) {
      cucumberWorld.axeBuilder = await initialiseAccessibilityChecking()
    }

    // Re-open a fresh browser session for each scenario
    // This ensures test isolation - each scenario starts with a clean browser state
    if (browser.sessionId) {
      await browser.reloadSession()
    }
  },

  afterStep: async function (step, scenario, result) {
    if (result.error) {
      await browser.takeScreenshot()
    }
  },

  afterScenario: async function (world, result, cucumberWorld) {
    await browser.takeScreenshot()
    // if (cucumberWorld.govUKUser !== undefined) {
    //   await addValueToPool('availableGovUKUsers', cucumberWorld.govUKUser)
    // }
    // if (cucumberWorld.govGatewayUser !== undefined) {
    //   await addValueToPool(
    //     'availableGovGatewayUsers',
    //     cucumberWorld.govGatewayUser
    //   )
    // }
  },
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  // /**
  //  * Gets executed once before all workers get launched.
  //  * @param {object} config wdio configuration object
  //  * @param {Array.<Object>} capabilities list of capabilities details
  //  */
  // onPrepare: async function (config, capabilities) {
  //   // Load test configuration from <env>.config.json
  //   // const testConfigData = readFileSync(
  //   //   `./test/support/${process.env.ENVIRONMENT}.config.json`,
  //   //   'utf8'
  //   // )
  //   // const testConfig = JSON.parse(testConfigData)
  //   // await setResourcePool('availableGovUKUsers', testConfig.govUKLogin)
  //   // await setResourcePool(
  //   //   'availableGovGatewayUsers',
  //   //   testConfig.govGatewayLogin
  //   // )
  // },
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: function (exitCode, config, capabilities, results) {
    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
}
