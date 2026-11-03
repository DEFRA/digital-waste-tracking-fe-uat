import allure from 'allure-commandline'
import { browser } from '@wdio/globals'
import { generateAccessibilityReportIndex } from './test/utils/accessibility-checking.js'
import { openZapSession, publishZapReports } from './test/setup/zap-reports.js'
import { TestConfig } from './test/setup/test-config.js'
import { TestEnv } from './test/setup/test-env.js'
import {
  browserProxyCapability,
  connectionRetryCount,
  cucumberOptions,
  execArgv,
  expireDefraIdStubUsers,
  prepareScenario,
  recordChromeSession,
  releasePooledUsers,
  reporters,
  screenshotOnFailure,
  seedUserPools,
  timeouts
} from './test/setup/wdio-shared.js'

const testEnv = new TestEnv()
const testConfig = new TestConfig(testEnv.environment, testEnv.proxyMode)

const debug = Boolean(testEnv.debug)
const maxInstances = testEnv.maxInstances
const workerArgv = [...execArgv]

if (debug) workerArgv.push('--inspect')

let scenarioSeen = false

/**
 * Opens the Allure report after the run.
 */
function openAllureReport() {
  generateAccessibilityReportIndex()
  const reportError = new Error('Could not generate Allure report')
  const generation = allure(['generate', 'allure-results', '--clean'])

  return new Promise((resolve, reject) => {
    const generationTimeout = setTimeout(() => reject(reportError), 60000)

    generation.on('exit', function (exitCode) {
      clearTimeout(generationTimeout)
      if (exitCode !== 0) return reject(reportError)
      allure(['open'])
      resolve()
    })
  })
}

const chromeOptions = {
  args: [
    '--no-sandbox',
    '--disable-infobars',
    '--disable-gpu',
    '--window-size=1920,1080'
  ],
  prefs: {
    'profile.default_content_setting_values.clipboard': 1
  }
}

export const config = {
  runner: 'local',
  specs: ['./test/features/**/*.feature'],
  maxInstances,
  capabilities: debug
    ? [
        {
          maxInstances,
          browserName: 'chrome',
          ...browserProxyCapability(testEnv),
          'goog:chromeOptions': chromeOptions
        }
      ]
    : [
        {
          maxInstances,
          browserName: 'chrome',
          ...browserProxyCapability(testEnv),
          'goog:chromeOptions': chromeOptions
        }
      ],
  execArgv: workerArgv,
  logLevel: debug ? 'debug' : 'info',
  logLevels: {
    webdriver: debug ? 'debug' : 'error'
  },
  bail: 0,
  baseUrl: testConfig.wasteOrganisationFrontendBaseUrl,
  waitforTimeout: timeouts.local.waitforTimeout,
  waitforInterval: 200,
  connectionRetryTimeout: timeouts.local.connectionRetryTimeout,
  connectionRetryCount,
  services: ['shared-store'],
  framework: 'cucumber',
  cucumberOpts: cucumberOptions({ timeout: timeouts.local.cucumber, testEnv }),
  reporters: reporters(),
  /**
   * @param {import('./test/types/globals.js').CucumberWorld} cucumberWorld
   */
  beforeScenario: async function (world, cucumberWorld) {
    await prepareScenario(world, cucumberWorld, testEnv, testConfig)
    recordChromeSession(cucumberWorld.testMemory)
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
    await releasePooledUsers(cucumberWorld.testMemory)
    await screenshotOnFailure(result, 'afterScenario')
    await expireDefraIdStubUsers(cucumberWorld.testMemory)
  },
  onPrepare: async function () {
    if (testEnv.environment === 'test') {
      await seedUserPools(new TestConfig('test'))
    }
    await openZapSession(testEnv, testConfig)
  },
  onComplete: async function () {
    await publishZapReports(testEnv)
    return openAllureReport()
  }
}
