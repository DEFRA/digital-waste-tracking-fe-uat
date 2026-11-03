import { bootstrap } from 'global-agent'
import AllureReporter from '@wdio/allure-reporter'
import { browser } from '@wdio/globals'
import { addValueToPool, setResourcePool } from '@wdio/shared-store-service'
import { TestConfig } from './test/setup/test-config.js'
import { TestEnv } from './test/setup/test-env.js'
import {
  connectionRetryCount,
  cucumberOptions,
  execArgv,
  expireDefraIdStubUsers,
  prepareScenario,
  releasePooledUsers,
  reporters,
  screenshotOnFailure,
  seedUserPools,
  timeouts,
  withMaxInstances,
  writeFailedFile
} from './test/setup/wdio-shared.js'

const testEnv = new TestEnv()
const testConfig = new TestConfig(testEnv.environment, testEnv.proxyMode)

if (testEnv.httpProxy && testEnv.proxyMode !== 'off') {
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = testEnv.httpProxy
}

const pageTimeouts = {
  script: 120000,
  pageLoad: 120000,
  implicit: 0
}

const chromiumClipboardOptions = {
  prefs: {
    'profile.default_content_setting_values.clipboard': 1
  }
}

const allCapabilities = [
  {
    browserName: 'Chrome',
    'bstack:options': {
      idleTimeout: 300,
      resolution: '1920x1080',
      browserVersion: 'latest',
      os: 'Windows',
      osVersion: '11'
    },
    'goog:chromeOptions': chromiumClipboardOptions,
    timeouts: pageTimeouts
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
    'ms:edgeOptions': chromiumClipboardOptions,
    timeouts: pageTimeouts
  },
  {
    browserName: 'Chrome',
    'bstack:options': {
      idleTimeout: 300,
      resolution: '1920x1080',
      browserVersion: 'latest',
      os: 'OS X',
      osVersion: 'Sonoma'
    },
    'goog:chromeOptions': chromiumClipboardOptions,
    timeouts: pageTimeouts
  },
  {
    browserName: 'Safari',
    'bstack:options': {
      idleTimeout: 300,
      resolution: '1920x1080',
      os: 'OS X',
      osVersion: 'Sonoma',
      browserVersion: '17.3'
    },
    timeouts: pageTimeouts
  },
  {
    browserName: 'chrome',
    'bstack:options': {
      osVersion: '13.0',
      deviceName: 'Samsung Galaxy S23 Ultra',
      consoleLogs: 'info',
      idleTimeout: 300
    },
    'goog:chromeOptions': chromiumClipboardOptions,
    timeouts: pageTimeouts
  },
  {
    browserName: 'chromium',
    'bstack:options': {
      osVersion: '26',
      deviceName: 'iPhone 15 Pro Max',
      consoleLogs: 'info',
      idleTimeout: 300
    },
    timeouts: pageTimeouts
  }
]

const compatibilityRun = testEnv.cucumberExtraTags.includes('@compatibility')
const environment = testEnv.environment

function selectedCapabilities() {
  if (testEnv.browserstackDesktopOnly) {
    return allCapabilities.filter(
      (capability) => !capability?.['bstack:options']?.deviceName
    )
  }
  if (environment === 'ext-test' || !compatibilityRun) {
    return [allCapabilities[0]]
  }
  return allCapabilities
}

const useProxy = Boolean(testEnv.httpProxy) && testEnv.proxyMode !== 'off'
const browserstackProxy = useProxy ? new URL(testEnv.httpProxy) : null

let scenarioSeen = false

/**
 * The runner config carries the requested capabilities. The browser client type omits them.
 * @param {object} options
 * @returns {WebdriverIO.Capabilities|undefined}
 */
function requestedCapabilities(options) {
  if (!('capabilities' in options)) return undefined
  const capabilities = /** @type {{ capabilities?: unknown }} */ (options)
    .capabilities
  if (
    !capabilities ||
    typeof capabilities !== 'object' ||
    Array.isArray(capabilities)
  ) {
    return undefined
  }
  return /** @type {WebdriverIO.Capabilities} */ (capabilities)
}

/**
 * Records the BrowserStack browser and device on the scenario.
 * @param {import('./test/setup/test-memory.js').TestMemory} testMemory
 */
async function recordBrowserstackSession(testMemory) {
  const capabilities = await browser.capabilities
  const requestedBstackOptions =
    requestedCapabilities(browser.options)?.['bstack:options'] ?? {}
  const browserInfo =
    `${capabilities.browserName} ${capabilities.browserVersion || ''}`.trim()
  const deviceInfo = requestedBstackOptions.deviceName
    ? `Device: ${requestedBstackOptions.deviceName}`
    : `OS: ${requestedBstackOptions.os} ${requestedBstackOptions.osVersion}`

  AllureReporter.addLabel('browser', browserInfo)
  AllureReporter.addLabel('platform', deviceInfo)
  AllureReporter.addDescription(
    `**Browser:** ${browserInfo}<br>**${deviceInfo}**`
  )
  testMemory.browserstackSessionId = browser.sessionId
  testMemory.browserInfo = browserInfo
  testMemory.deviceInfo = deviceInfo
}

/**
 * Returns the account to the combined BrowserStack pool.
 * @param {import('./test/setup/test-memory.js').TestMemory} testMemory
 */
async function releaseBrowserstackUsers(testMemory) {
  if (testMemory.govUKUser !== undefined) {
    await addValueToPool('availableUsers', testMemory.govUKUser)
  }
  if (testMemory.govGatewayUser !== undefined) {
    await addValueToPool('availableUsers', testMemory.govGatewayUser)
  }
}

export const config = {
  runner: 'local',
  baseUrl: testConfig.wasteOrganisationFrontendBaseUrl,
  user: testEnv.browserstackUsername,
  key: testEnv.browserstackKey,
  specs: ['./test/features/waste-organisation-frontend/**/*.feature'],
  exclude: [],
  maxInstances: testEnv.maxInstances,
  commonCapabilities: {
    'bstack:options': {
      buildName: compatibilityRun
        ? `digital-waste-tracking-fe-uat-${environment}-compatibility`
        : `digital-waste-tracking-fe-uat-${environment}`
    }
  },
  capabilities: withMaxInstances(selectedCapabilities(), testEnv),
  services: [
    'shared-store',
    [
      'browserstack',
      {
        testObservability: true,
        testObservabilityOptions: {
          user: testEnv.browserstackUsername,
          key: testEnv.browserstackKey,
          projectName: 'digital-waste-tracking-fe',
          buildName: `digital-waste-tracking-fe-uat-${environment}`
        },
        acceptInsecureCerts: true,
        forceLocal: false,
        browserstackLocal: true,
        ...(browserstackProxy && {
          opts: {
            binarypath: '/root/.browserstack/BrowserStackLocal',
            verbose: true,
            proxyHost: browserstackProxy.hostname,
            proxyPort: Number(browserstackProxy.port || 80)
          }
        })
      }
    ]
  ],
  execArgv: testEnv.debug ? [...execArgv, '--inspect'] : execArgv,
  logLevel: 'debug',
  bail: 0,
  waitforTimeout: timeouts.browserstack.waitforTimeout,
  waitforInterval: 200,
  connectionRetryTimeout: timeouts.browserstack.connectionRetryTimeout,
  connectionRetryCount,
  framework: 'cucumber',
  cucumberOpts: cucumberOptions({ timeout: timeouts.browserstack.cucumber, testEnv }),
  reporters: reporters({ disableWebdriverStepsReporting: true }),
  /**
   * @param {import('./test/types/globals.js').CucumberWorld} cucumberWorld
   */
  beforeScenario: async function (world, cucumberWorld) {
    await prepareScenario(world, cucumberWorld, testEnv, testConfig)
    await recordBrowserstackSession(cucumberWorld.testMemory)
    if (scenarioSeen && browser.sessionId) {
      await browser.reloadSession()
    }
    scenarioSeen = true
  },
  afterStep: async function (_step, _scenario, result) {
    await screenshotOnFailure(result, 'afterStep')
  },
  /**
   * @param {import('./test/types/globals.js').CucumberWorld} cucumberWorld
   */
  afterScenario: async function (_world, result, cucumberWorld) {
    const testMemory = cucumberWorld.testMemory
    await releasePooledUsers(testMemory)
    await releaseBrowserstackUsers(testMemory)
    await screenshotOnFailure(result, 'afterScenario')
    await expireDefraIdStubUsers(testMemory)
  },
  onPrepare: async function () {
    if (testEnv.environment === 'test') {
      const pools = new TestConfig('test')
      await seedUserPools(pools)
      const users = pools.govUKLogin
        .concat(pools.govGatewayLogin)
        .sort(() => Math.random() - 0.5)
      await setResourcePool('availableUsers', users)
    }
  },
  onComplete: async function (_exitCode, _config, _capabilities, results) {
    writeFailedFile(results)
  }
}
