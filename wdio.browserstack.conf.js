import { ProxyAgent, setGlobalDispatcher } from 'undici'
import { bootstrap } from 'global-agent'
import { initialiseAccessibilityChecking } from './test/utils/accessibility-checking.js'
import fs from 'node:fs'
import { readFileSync } from 'fs'
import { setResourcePool, addValueToPool } from '@wdio/shared-store-service'
import { ApiFactory } from './test/utils/apis/api-factory.js'

// const debug = process.env.DEBUG
// const oneMinute = 60 * 1000
// const oneHour = 60 * 60 * 1000

/**
 * Enable webdriver.io to use the outbound proxy.
 * This is required for the test suite to be able to talk to BrowserStack.
 */
// Only use proxy if HTTP_PROXY is set (for CDP environments)
if (process.env.HTTP_PROXY) {
  const dispatcher = new ProxyAgent({
    uri: process.env.HTTP_PROXY || 'http://localhost:3128'
  })
  setGlobalDispatcher(dispatcher)
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = process.env.HTTP_PROXY
}

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
  specs: [
    './test/features/waste-organisation-frontend/User_Journeys_BrowserStack.feature'
  ],

  // Tests to exclude
  exclude: [],
  // maxInstances: 1,

  commonCapabilities: {
    'bstack:options': {
      // its preferable to run tests always on "test" or "ext-test" environment as they have real defraId integrations
      // rather than mock defraId integrations
      buildName: `digital-waste-tracking-fe-uat-${process.env.ENVIRONMENT}`
    }
  },

  // https://www.gov.uk/service-manual/technology/designing-for-different-browsers-and-devices
  capabilities: [
    // windows
    {
      browserName: 'Chrome',
      'bstack:options': {
        idleTimeout: 300,
        resolution: '1920x1080',
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      },
      timeouts: {
        script: 120000, // 120 seconds for async script execution
        pageLoad: 120000, // 120 seconds for page load
        implicit: 0 // Don't use implicit waits (use explicit waits instead)
      }
    },
    {
      browserName: 'Edge',
      'bstack:options': {
        idleTimeout: 300,
        resolution: '1920x1080',
        browserVersion: 'latest',
        os: 'Windows',
        osVersion: '11'
      },
      timeouts: {
        script: 120000, // 120 seconds for async script execution
        pageLoad: 120000, // 120 seconds for page load
        implicit: 0 // Don't use implicit waits (use explicit waits instead)
      }
    },
    // macOS
    {
      browserName: 'Chrome',
      'bstack:options': {
        idleTimeout: 300,
        resolution: '1920x1080',
        browserVersion: 'latest',
        os: 'OS X',
        osVersion: 'Sonoma' // Changed from 'Sequoia'
      },
      timeouts: {
        script: 120000, // 120 seconds for async script execution
        pageLoad: 120000, // 120 seconds for page load
        implicit: 0 // Don't use implicit waits (use explicit waits instead)
      }
    },
    // Android
    {
      browserName: 'chrome',
      'bstack:options': {
        osVersion: '13.0',
        deviceName: 'Samsung Galaxy S23 Ultra',
        consoleLogs: 'info',
        idleTimeout: 300
      },
      timeouts: {
        script: 120000, // 120 seconds for async script execution
        pageLoad: 120000, // 120 seconds for page load
        implicit: 0 // Don't use implicit waits (use explicit waits instead)
      }
    }
  ],

  services: [
    'shared-store',
    [
      'browserstack',
      {
        testObservability: true, // Disable if you do not want to use the browserstack test observer functionality
        testObservabilityOptions: {
          user: process.env.BROWSERSTACK_USERNAME,
          key: process.env.BROWSERSTACK_KEY,
          projectName: 'digital-waste-tracking-fe', // should match project in browserstack
          buildName: `digital-waste-tracking-fe-uat-${process.env.ENVIRONMENT}`
        },
        acceptInsecureCerts: true,
        forceLocal: false,
        browserstackLocal: true,
        // **this is only needed for CDP runs with proxy
        ...(process.env.HTTP_PROXY && {
          opts: {
            binarypath: '/root/.browserstack/BrowserStackLocal',
            verbose: true,
            proxyHost: 'localhost',
            proxyPort: 3128
          }
        })
      }
    ]
  ],

  execArgv: ['--loader', 'esm-module-alias/loader'],

  logLevel: 'debug', // Changed from 'info' for better debugging

  // Number of failures before the test suite bails.
  bail: 0,
  waitforTimeout: 120000, // 120 seconds for element waits
  waitforInterval: 200,
  connectionRetryTimeout: 120000, // Increased from 6000 (6s) to 120000 (120s) for BrowserStack
  connectionRetryCount: 3,
  framework: 'cucumber',
  cucumberOpts: {
    timeout: 180000, // Increased from 120000 (120s) to 180000 (180s) for BrowserStack network latency
    require: ['./test/step-definitions/**/*.js'],
    tags: `@browserstack`
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

  // Hooks
  //
  // =====
  // Cucumber Hooks
  // =====
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
    }
  },

  beforeScenario: async function (world, cucumberWorld) {
    // IMPORTANT: In WebdriverIO, the world object in hooks may not be the same instance
    // as 'this' in step definitions. We need to ensure properties are set on the world object
    // that will be accessible in step definitions.

    // Log BrowserStack session information
    const sessionId = browser.sessionId
    const capabilities = await browser.capabilities
    const deviceInfo = capabilities.deviceName ? `Device: ${capabilities.deviceName}` : `OS: ${capabilities.os} ${capabilities.osVersion}`
    
    // eslint-disable-next-line no-console
    console.log('\n🔧 BrowserStack Session Info:')
    // eslint-disable-next-line no-console
    console.log(`  Session ID: ${sessionId}`)
    // eslint-disable-next-line no-console
    console.log(`  Browser: ${capabilities.browserName} ${capabilities.browserVersion || ''}`)
    // eslint-disable-next-line no-console
    console.log(`  ${deviceInfo}`)
    // eslint-disable-next-line no-console
    console.log(`  View in Dashboard: https://automate.browserstack.com/dashboard/v2/search?query=${sessionId}`)

    // Initialize world object properties here
    // These will be accessible in step definitions via 'this'
    cucumberWorld.pageName = null // Initialize, will be set in step definitions
    cucumberWorld.tags = world.pickle.tags.map((tag) => tag.name).join(', ')
    cucumberWorld.axeBuilder = null
    cucumberWorld.env = process.env
    cucumberWorld.browserstackSessionId = sessionId  // Make session ID accessible in steps

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
      try {
        await browser.takeScreenshot()
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(
          'Failed to take screenshot after step error:',
          error.message
        )
      }
    }
  },

  afterScenario: async function (world, result, cucumberWorld) {
    try {
      await browser.takeScreenshot()
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Failed to take screenshot after scenario:', error.message)
    }
    if (cucumberWorld.govUKUser !== undefined) {
      await addValueToPool('availableGovUKUsers', cucumberWorld.govUKUser)
    }
    if (cucumberWorld.govGatewayUser !== undefined) {
      await addValueToPool(
        'availableGovGatewayUsers',
        cucumberWorld.govGatewayUser
      )
    }
  },
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
