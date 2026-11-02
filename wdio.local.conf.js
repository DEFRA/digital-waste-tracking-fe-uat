import { createHooks, openAllureReport } from './test/setup/hooks.js'
import { publishZapReports } from './test/setup/zap-reports.js'
import { TestConfig } from './test/setup/test-config.js'
import { TestEnv } from './test/setup/test-env.js'
import {
  browserProxyCapability,
  connectionRetryCount,
  cucumberOptions,
  execArgv,
  timeouts,
  reporters
} from './test/setup/wdio-shared.js'

const testEnv = new TestEnv()
if (!testEnv.environment) throw new Error('ENVIRONMENT is not set')

const supportPrefix =
  testEnv.proxyMode === 'zap'
    ? `${testEnv.environment}.zap`
    : testEnv.environment
const testConfig = new TestConfig(supportPrefix)

const debug = Boolean(testEnv.debug)
const maxInstances = testEnv.maxInstances
const workerArgv = [...execArgv]

if (debug) workerArgv.push('--inspect')

const chromeOptions = {
  args: [
    '--no-sandbox',
    '--disable-infobars',
    '--disable-gpu',
    '--window-size=1920,1080'
  ]
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
          ...browserProxyCapability(testEnv)
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
  ...createHooks({ driver: 'local', testEnv, testConfig }),
  onComplete: async function () {
    await publishZapReports(testEnv)
    return openAllureReport()
  }
}
