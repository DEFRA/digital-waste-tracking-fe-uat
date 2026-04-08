import fs from 'node:fs'
import {
  initialiseAccessibilityChecking,
  generateAccessibilityReportIndex
} from './test/utils/accessibility-checking.js'
import { readFileSync } from 'fs'
import { setResourcePool, addValueToPool } from '@wdio/shared-store-service'
import { ApiFactory } from './test/utils/apis/api-factory.js'
import { browser } from '@wdio/globals'
import logger from '@wdio/logger'
import { buildCucumberTagExpression } from './test/utils/cucumber-tag-expression.js'
import {
  addAllureIssueLinksFromPickleTags,
  ALLURE_ISSUE_LINK_TEMPLATE
} from './test/utils/allure-utils.js'
const log = logger('wdio.conf.js')

/** Cucumber @env_* tag: dev and perf-test scenarios use @env_dev */
const cucumberEnvTag =
  process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'perf-test'
    ? 'dev'
    : process.env.ENVIRONMENT

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

  // Connection to remote chromedriver
  hostname: process.env.CHROMEDRIVER_URL || '127.0.0.1',
  port: process.env.CHROMEDRIVER_PORT || 4444,

  // Tests to run
  // specs: ['./test/specs/**/*.js'],
  specs: ['./test/features/**/*.feature'],
  // Tests to exclude
  exclude: [],
  maxInstances: 1,

  capabilities: [
    {
      ...(process.env.HTTP_PROXY && {
        proxy: {
          proxyType: 'manual',
          httpProxy: new URL(process.env.HTTP_PROXY).host,
          sslProxy: new URL(process.env.HTTP_PROXY).host
        }
      }),
      browserName: 'chrome',
      'se:downloadsEnabled': true,
      'goog:chromeOptions': {
        args: [
          '--no-sandbox',
          '--disable-infobars',
          '--headless',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--enable-features=NetworkService,NetworkServiceInProcess',
          '--password-store=basic',
          '--use-mock-keychain',
          '--dns-prefetch-disable',
          '--disable-background-networking',
          '--disable-remote-fonts',
          '--ignore-certificate-errors',
          '--disable-dev-shm-usage'
        ],
        prefs: {
          // Use absolute path for download directory
          // 'download.default_directory': '/home/seluser/Downloads',
          'profile.default_content_settings.popups': 0, // Disable popup
          'download.prompt_for_download': false // Auto-download
        }
      }
    }
  ],

  execArgv: ['--loader', 'esm-module-alias/loader'],

  logLevel: 'info',

  logLevels: {
    webdriver: 'error'
  },

  // Number of failures before the test suite bails.
  bail: 0,
  waitforTimeout: 20000,
  waitforInterval: 200,
  connectionRetryTimeout: 6000,
  connectionRetryCount: 3,
  services: ['shared-store'],
  framework: 'cucumber',
  cucumberOpts: {
    timeout: 60000,
    require: ['./test/step-definitions/**/*.js'],
    tags: buildCucumberTagExpression(cucumberEnvTag),
    failAmbiguousDefinitions: true,
    ignoreUndefinedDefinitions: false
  },

  reporters: [
    [
      // Spec reporter provides rolling output to the logger so you can see it in-progress
      'spec',
      {
        addConsoleLogs: true,
        realtimeReporting: true,
        color: false
      }
    ],
    [
      'allure',
      {
        outputDir: 'allure-results',
        issueLinkTemplate: ALLURE_ISSUE_LINK_TEMPLATE,
        useCucumberStepReporter: true,
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ],

  // reporters: [
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

  //
  // =====
  // Hooks
  // =====
  //
  // =====
  // Cucumber Hooks
  // =====
  beforeScenario: async function (world, cucumberWorld) {
    await addAllureIssueLinksFromPickleTags(
      world.pickle,
      ALLURE_ISSUE_LINK_TEMPLATE
    )
    // IMPORTANT: In WebdriverIO, the world object in hooks may not be the same instance
    // as 'this' in step definitions. We need to ensure properties are set on the world object
    // that will be accessible in step definitions.

    // Initialize world object properties here
    // These will be accessible in step definitions via 'this'
    cucumberWorld.pageName = null // Initialize, will be set in step definitions
    cucumberWorld.tags = world.pickle.tags.map((tag) => tag.name).join(', ')
    cucumberWorld.axeBuilder = null
    // Load test configuration from <env>.config.json
    const testConfigData = readFileSync(
      `./test/support/${process.env.ENVIRONMENT}.config.json`,
      'utf8'
    )
    cucumberWorld.testConfig = JSON.parse(testConfigData)
    cucumberWorld.env = process.env
    const wasteOrganisationBackendServiceUrl = process.env.xapikey
      ? `https://ephemeral-protected.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/waste-organisation-backend`
      : cucumberWorld.testConfig.wasteOrganisationBackendServiceUrl
    const wasteMovementBackendServiceUrl = process.env.xapikey
      ? `https://ephemeral-protected.api.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/waste-movement-backend`
      : cucumberWorld.testConfig.wasteMovementBackendServiceUrl
    cucumberWorld.apis = ApiFactory.create(
      wasteOrganisationBackendServiceUrl,
      wasteMovementBackendServiceUrl,
      cucumberWorld.testConfig.wasteMovementExternalApiBaseUrl,
      cucumberWorld.testConfig.cognitoOAuthBaseUrl,
      cucumberWorld.env.HTTP_PROXY
    )
    if (world.pickle.tags.find((tag) => tag.name === '@accessibility')) {
      cucumberWorld.axeBuilder = await initialiseAccessibilityChecking()
    }

    const capabilities = browser.capabilities
    const browserInfo =
      `${capabilities.browserName ?? ''} ${capabilities.browserVersion ?? ''}`.trim()
    const deviceInfo =
      capabilities.deviceName ?? `OS: ${capabilities.platformName ?? 'local'}`
    cucumberWorld.browserInfo = browserInfo
    cucumberWorld.deviceInfo = deviceInfo

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
    if (cucumberWorld.govUKUser !== undefined) {
      await addValueToPool('availableGovUKUsers', cucumberWorld.govUKUser)
    }
    if (cucumberWorld.govGatewayUser !== undefined) {
      await addValueToPool(
        'availableGovGatewayUsers',
        cucumberWorld.govGatewayUser
      )
    }
    if (cucumberWorld.multipleBusinessesGovUKUser !== undefined) {
      await addValueToPool(
        'availableMultipleBusinessesGovUKUsers',
        cucumberWorld.multipleBusinessesGovUKUser
      )
    }
    if (cucumberWorld.defraIdMockUserId !== undefined) {
      // cleanup the user from the defra id mock service
      log.info(
        `cleaning up the user from the defra id mock service: ${cucumberWorld.defraIdMockUserId}`
      )
      await browser.url(
        `https://cdp-defra-id-stub.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cdp-defra-id-stub/register/${cucumberWorld.defraIdMockUserId}/expire`
      )
    }
  },
  // WebdriverIO provides several hooks you can use to interfere with the test process in order to enhance
  // it and to build services around it. You can either apply a single function or an array of
  // methods to it. If one of them returns with a promise, WebdriverIO will wait until that promise got
  // resolved to continue.
  /**
   * Gets executed once before all workers get launched.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   */
  onPrepare: async function (config, capabilities) {
    if (process.env.ENVIRONMENT === 'test') {
      // Load test configuration from <env>.config.json
      const testConfigData = readFileSync(
        `./test/support/${process.env.ENVIRONMENT}.config.json`,
        'utf8'
      )
      const testConfig = JSON.parse(testConfigData)
      await setResourcePool('availableGovUKUsers', testConfig.govUKLogin)
      await setResourcePool(
        'availableGovGatewayUsers',
        testConfig.govGatewayLogin
      )
      await setResourcePool(
        'availableMultipleBusinessesGovUKUsers',
        testConfig.multipleBusinessesGovUKLogin
      )
    }
  },
  /**
   * Gets executed before a worker process is spawned and can be used to initialise specific service
   * for that worker as well as modify runtime environments in an async fashion.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {object} caps     object containing capabilities for session that will be spawn in the worker
   * @param  {object} specs    specs to be run in the worker process
   * @param  {object} args     object that will be merged with the main configuration once worker is initialized
   * @param  {object} execArgv list of string arguments passed to the worker process
   */
  // onWorkerStart: function (cid, caps, specs, args, execArgv) {},
  /**
   * Gets executed just after a worker process has exited.
   * @param  {string} cid      capability id (e.g 0-0)
   * @param  {number} exitCode 0 - success, 1 - fail
   * @param  {object} specs    specs to be run in the worker process
   * @param  {number} retries  number of retries used
   */
  // onWorkerEnd: function (cid, exitCode, specs, retries) {},
  /**
   * Gets executed just before initialising the webdriver session and test framework. It allows you
   * to manipulate configurations depending on the capability or spec.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that are to be run
   * @param {string} cid worker id (e.g. 0-0)
   */
  // beforeSession: function (config, capabilities, specs, cid) {},
  /**
   * Gets executed before test execution begins. At this point you can access to all global
   * variables like `browser`. It is the perfect place to define custom commands.
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs        List of spec file paths that are to be run
   * @param {object}         browser      instance of created browser/device session
   */
  // before: function (capabilities, specs) {},
  /**
   * Runs before a WebdriverIO command gets executed.
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   */
  // beforeCommand: function (commandName, args) {},
  /**
   * Hook that gets executed before the suite starts
   * @param {object} suite suite details
   */
  // beforeSuite: function (suite) {},
  /**
   * Function to be executed before a test (in Mocha/Jasmine) starts.
   */
  // beforeTest: function (test, context) {},
  /**
   * Hook that gets executed _before_ a hook within the suite starts (e.g. runs before calling
   * beforeEach in Mocha)
   */
  // beforeHook: function (test, context) {},
  /**
   * Hook that gets executed _after_ a hook within the suite starts (e.g. runs after calling
   * afterEach in Mocha)
   */
  // afterHook: function (
  //   test,
  //   context,
  //   { error, result, duration, passed, retries }
  // ) {},
  /**
   * Function to be executed after a test (in Mocha/Jasmine only)
   * @param {object}  test             test object
   * @param {object}  context          scope object the test was executed with
   * @param {Error}   result.error     error object in case the test fails, otherwise `undefined`
   * @param {*}       result.result    return object of test function
   * @param {number}  result.duration  duration of test
   * @param {boolean} result.passed    true if test has passed, otherwise false
   * @param {object}  result.retries   information about spec related retries, e.g. `{ attempts: 0, limit: 0 }`
   */
  // afterTest: async function (
  //   test,
  //   context,
  //   { error, result, duration, passed, retries }
  // ) {
  //   if (error) {
  //     await browser.takeScreenshot()
  //   }
  // },

  /**
   * Hook that gets executed after the suite has ended
   * @param {object} suite suite details
   */
  // afterSuite: function (suite) {},
  /**
   * Runs after a WebdriverIO command gets executed
   * @param {string} commandName hook command name
   * @param {Array} args arguments that command would receive
   * @param {number} result 0 - command success, 1 - command error
   * @param {object} error error object if any
   */
  // afterCommand: function (commandName, args, result, error) {},
  /**
   * Gets executed after all tests are done. You still have access to all global variables from
   * the test.
   * @param {number} result 0 - test pass, 1 - test fail
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // after: function (result, capabilities, specs) {},
  /**
   * Gets executed right after terminating the webdriver session.
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {Array.<String>} specs List of spec file paths that ran
   */
  // afterSession: function (config, capabilities, specs) {},
  /**
   * Gets executed after all workers got shut down and the process is about to exit. An error
   * thrown in the onComplete hook will result in the test run failing.
   * @param {object} exitCode 0 - success, 1 - fail
   * @param {object} config wdio configuration object
   * @param {Array.<Object>} capabilities list of capabilities details
   * @param {<Object>} results object containing test results
   */
  onComplete: function (exitCode, config, capabilities, results) {
    generateAccessibilityReportIndex()

    // !Do Not Remove! Required for test status to show correctly in portal.
    if (results?.failed && results.failed > 0) {
      fs.writeFileSync('FAILED', JSON.stringify(results))
    }
  }
  /**
   * Gets executed when a refresh happens.
   * @param {string} oldSessionId session ID of the old session
   * @param {string} newSessionId session ID of the new session
   */
  // onReload: function (oldSessionId, newSessionId) {}
}
