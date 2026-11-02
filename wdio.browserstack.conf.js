import { bootstrap } from 'global-agent'
import { createHooks } from './test/setup/hooks.js'
import { TestConfig } from './test/setup/test-config.js'
import { TestEnv } from './test/setup/test-env.js'
import {
  connectionRetryCount,
  cucumberOptions,
  execArgv,
  timeouts,
  reporters,
  withMaxInstances
} from './test/setup/wdio-shared.js'

const testEnv = new TestEnv()
if (!testEnv.environment) throw new Error('ENVIRONMENT is not set')

const supportPrefix =
  testEnv.proxyMode === 'zap'
    ? `${testEnv.environment}.zap`
    : testEnv.environment
const testConfig = new TestConfig(supportPrefix)

if (testEnv.httpProxy && testEnv.proxyMode !== 'off') {
  bootstrap()
  global.GLOBAL_AGENT.HTTP_PROXY = testEnv.httpProxy
}

const pageTimeouts = {
  script: 120000,
  pageLoad: 120000,
  implicit: 0
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
  ...createHooks({ driver: 'browserstack', testEnv, testConfig })
}
