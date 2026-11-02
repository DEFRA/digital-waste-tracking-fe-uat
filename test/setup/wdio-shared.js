import { ALLURE_ISSUE_LINK_TEMPLATE } from '../utils/allure-utils.js'
import { buildCucumberTagExpression } from '../utils/cucumber-tag-expression.js'

export const execArgv = ['--loader', 'esm-module-alias/loader']

export const connectionRetryCount = 3

export const timeouts = {
  grid: {
    waitforTimeout: 20000,
    connectionRetryTimeout: 120000,
    cucumber: 60000
  },
  local: {
    waitforTimeout: 10000,
    connectionRetryTimeout: 60000,
    cucumber: 60000
  },
  browserstack: {
    waitforTimeout: 120000,
    connectionRetryTimeout: 120000,
    cucumber: 180000
  }
}

export const sidecarPageTimeouts = { pageLoad: 60000, script: 30000 }

export const sidecarChromeArgs = [
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
]

export const sidecarChromePrefs = {
  'profile.default_content_settings.popups': 0,
  'download.prompt_for_download': false
}

/**
 * @param {{ timeout: number, retry?: number, testEnv: import('./test-env.js').TestEnv }} options
 */
export function cucumberOptions({ timeout, retry, testEnv }) {
  const tags = buildCucumberTagExpression(testEnv.cucumberExtraTags)
  return {
    timeout,
    require: ['./test/step-definitions/**/*.js'],
    ...(tags ? { tags } : {}),
    failAmbiguousDefinitions: true,
    ignoreUndefinedDefinitions: false,
    ...(retry ? { retry } : {})
  }
}

/**
 * @param {{ detailedSpec?: boolean, disableWebdriverStepsReporting?: boolean }} [options]
 */
export function reporters({
  detailedSpec = false,
  disableWebdriverStepsReporting = false
} = {}) {
  const spec = detailedSpec
    ? [
        'spec',
        {
          addConsoleLogs: true,
          realtimeReporting: true,
          color: false
        }
      ]
    : 'spec'

  return [
    spec,
    [
      'allure',
      {
        outputDir: 'allure-results',
        issueLinkTemplate: ALLURE_ISSUE_LINK_TEMPLATE,
        useCucumberStepReporter: true,
        disableWebdriverStepsReporting,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ]
}

/**
 * Chrome proxy when this mode sends the browser through HTTP_PROXY.
 * cdp and zap do. off does not. Chrome wants host:port.
 * The proxy certificate is trusted, the same as a proxied API call.
 * @param {import('./test-env.js').TestEnv} testEnv
 * @returns {object}
 */
export function browserProxyCapability(testEnv) {
  if (testEnv.proxyMode === 'off' || !testEnv.httpProxy) return {}
  const proxy = new URL(testEnv.httpProxy)
  const host = proxy.port ? `${proxy.hostname}:${proxy.port}` : proxy.hostname
  return {
    acceptInsecureCerts: true,
    proxy: {
      proxyType: 'manual',
      httpProxy: host,
      sslProxy: host
    }
  }
}

/**
 * @param {object[]} capabilities
 * @param {import('./test-env.js').TestEnv} testEnv
 * @returns {object[]}
 */
export function withMaxInstances(capabilities, testEnv) {
  const maxInstances = testEnv.maxInstances
  return capabilities.map((capability) => ({
    ...capability,
    maxInstances
  }))
}
