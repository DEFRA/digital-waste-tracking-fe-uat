import { createHooks } from './test/setup/hooks.js'
import { TestConfig } from './test/setup/test-config.js'
import { TestEnv } from './test/setup/test-env.js'
import {
  browserProxyCapability,
  connectionRetryCount,
  cucumberOptions,
  execArgv,
  timeouts,
  reporters,
  sidecarChromeArgs,
  sidecarChromePrefs,
  sidecarPageTimeouts
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
        args: sidecarChromeArgs,
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
  ...createHooks({ driver: 'grid', testEnv, testConfig })
}
