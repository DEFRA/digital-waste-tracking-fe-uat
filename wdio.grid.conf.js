import { browser } from '@wdio/globals'
import { generateAccessibilityReportIndex } from './test/utils/accessibility-checking.js'
import { TestConfig } from './test/setup/test-config.js'
import { TestEnv } from './test/setup/test-env.js'
import { openZapSession, publishZapReports } from './test/setup/zap-reports.js'
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
  sidecarChromeArgs,
  sidecarChromePrefs,
  sidecarPageTimeouts,
  timeouts,
  writeFailedFile
} from './test/setup/wdio-shared.js'

const testEnv = new TestEnv()
const testConfig = new TestConfig(testEnv.environment, testEnv.proxyMode)

/**
 * Adds the insecure-origin flag when the admin UI CI uses plain HTTP.
 * @param {string|undefined} adminUiBaseUrl
 * @returns {string[]}
 */
function gridChromeArgs(adminUiBaseUrl) {
  if (!adminUiBaseUrl) return sidecarChromeArgs
  const url = new URL(adminUiBaseUrl)
  if (url.protocol !== 'http:' || url.hostname === 'localhost') {
    return sidecarChromeArgs
  }
  return [
    ...sidecarChromeArgs,
    `--unsafely-treat-insecure-origin-as-secure=${url.origin}`
  ]
}

const debug = Boolean(testEnv.debug)
const maxInstances = testEnv.maxInstances
const workerArgv = [...execArgv]

if (debug) workerArgv.push('--inspect')

let scenarioSeen = false

export const config = {
  runner: 'local',
  baseUrl: testConfig.wasteOrganisationFrontendBaseUrl,
  hostname: testEnv.gridHost,
  port: testEnv.gridPort,
  specs: ['./test/features/**/*.feature'],
  exclude: [],
  maxInstances,
  capabilities: [
    {
      maxInstances,
      ...browserProxyCapability(testEnv),
      browserName: 'chrome',
      'se:downloadsEnabled': true,
      timeouts: sidecarPageTimeouts,
      'goog:chromeOptions': {
        args: gridChromeArgs(testEnv.adminUiBaseUrl),
        prefs: sidecarChromePrefs
      }
    }
  ],
  execArgv: workerArgv,
  logLevel: debug ? 'debug' : 'info',
  logLevels: {
    webdriver: debug ? 'debug' : 'error'
  },
  bail: 0,
  waitforTimeout: timeouts.grid.waitforTimeout,
  waitforInterval: 200,
  connectionRetryTimeout: timeouts.grid.connectionRetryTimeout,
  connectionRetryCount,
  services: ['shared-store'],
  framework: 'cucumber',
  cucumberOpts: cucumberOptions({ timeout: timeouts.grid.cucumber, testEnv }),
  reporters: reporters({ detailedSpec: true }),
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
  onComplete: async function (_exitCode, _config, _capabilities, results) {
    generateAccessibilityReportIndex()
    writeFailedFile(results)
    await publishZapReports(testEnv)
  }
}
