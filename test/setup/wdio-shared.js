import fs from 'node:fs'
import { browser } from '@wdio/globals'
import logger from '@wdio/logger'
import { addStep } from '@wdio/allure-reporter'
import { addValueToPool, setResourcePool } from '@wdio/shared-store-service'
import { ApiFactory } from '../utils/apis/api-factory.js'
import { initialiseAccessibilityChecking } from '../utils/accessibility-checking.js'
import {
  ALLURE_ISSUE_LINK_TEMPLATE,
  addAllureIssueLinksFromPickleTags
} from '../utils/allure-utils.js'
import { TestMemory } from './test-memory.js'

const log = logger('wdio')

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
  // const tags = buildCucumberTagExpression(testEnv.cucumberExtraTags)
  const tags = testEnv.cucumberExtraTags || undefined
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

/**
 * Attaches TestEnv, TestConfig, and a new TestMemory, then opens the API clients.
 * @param {{ pickle: { tags: { name: string }[] } }} world
 * @param {import('../types/globals.js').CucumberWorld} cucumberWorld
 * @param {import('./test-env.js').TestEnv} testEnv
 * @param {import('./test-config.js').TestConfig} testConfig
 */
export async function prepareScenario(
  world,
  cucumberWorld,
  testEnv,
  testConfig
) {
  const testMemory = new TestMemory()
  cucumberWorld.testEnv = testEnv
  cucumberWorld.testConfig = testConfig
  cucumberWorld.testMemory = testMemory
  await addAllureIssueLinksFromPickleTags(
    world.pickle,
    ALLURE_ISSUE_LINK_TEMPLATE
  )
  testMemory.tags = world.pickle.tags.map((tag) => tag.name).join(', ')
  testMemory.apis = ApiFactory.create(testEnv, testConfig)
  testMemory.apis.govPayAPI.setAuthorizationHeader(testEnv.govPayApiKey)

  if (world.pickle.tags.find((tag) => tag.name === '@accessibility')) {
    testMemory.axeBuilder = await initialiseAccessibilityChecking()
  }
}

/**
 * Stores this worker's Chrome name on the scenario.
 * @param {import('./test-memory.js').TestMemory} testMemory
 */
export function recordChromeSession(testMemory) {
  const capabilities =
    /** @type {WebdriverIO.Capabilities & { deviceName?: string }} */ (
      browser.capabilities
    )
  const browserName = capabilities.browserName ?? ''
  const browserVersion = capabilities.browserVersion ?? ''
  testMemory.browserInfo = `${browserName} ${browserVersion}`.trim()
  testMemory.deviceInfo =
    capabilities.deviceName ?? `OS: ${capabilities.platformName ?? 'local'}`
}

/**
 * Saves a screenshot when the step or scenario failed.
 * @param {{ passed?: boolean, error?: unknown }} result
 * @param {string} where
 */
export async function screenshotOnFailure(result, where) {
  if (result.passed !== false && !result.error) return
  try {
    await browser.takeScreenshot()
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    log.warn(`${where}: screenshot failed — ${message}`)
  }
}

/**
 * Returns Gov.UK and Government Gateway users this scenario checked out.
 * @param {import('./test-memory.js').TestMemory} testMemory
 */
export async function releasePooledUsers(testMemory) {
  if (testMemory.govUKUser !== undefined) {
    if (testMemory.userWithMultipleBusinesses === true) {
      addStep(
        `adding multiple businesses gov uk user ${testMemory.govUKUser} to the pool`
      )
      await addValueToPool(
        'availableMultipleBusinessesGovUKUsers',
        testMemory.govUKUser
      )
    } else if (testMemory.doNotAddUserToPool === true) {
      // This user is not returned to the pool.
    } else {
      addStep(`adding gov uk user ${testMemory.govUKUser} to the pool`)
      await addValueToPool('availableGovUKUsers', testMemory.govUKUser)
    }
  }
  if (testMemory.govGatewayUser !== undefined) {
    addStep(`adding gov gateway user ${testMemory.govGatewayUser} to the pool`)
    await addValueToPool('availableGovGatewayUsers', testMemory.govGatewayUser)
  }
  if (testMemory.multipleBusinessesGovUKUser !== undefined) {
    await addValueToPool(
      'availableMultipleBusinessesGovUKUsers',
      testMemory.multipleBusinessesGovUKUser
    )
  }
}

/**
 * Expires Defra ID stub users this scenario registered.
 * @param {import('./test-memory.js').TestMemory} testMemory
 */
export async function expireDefraIdStubUsers(testMemory) {
  const defraIdMockUserIds = [
    testMemory.defraIdMockUserId,
    testMemory.differentDefraIdMockUserId
  ].filter(Boolean)
  for (const defraIdMockUserId of defraIdMockUserIds) {
    log.info(
      `cleaning up the user from the defra id mock service: ${defraIdMockUserId}`
    )
    try {
      await testMemory.apis.defraIdStubAPI.expireUser(defraIdMockUserId)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      log.warn(`afterScenario: defraId expireUser failed — ${message}`)
    }
  }
}

/**
 * Fills the three account pools from the test support file.
 * @param {import('./test-config.js').TestConfig} pools
 */
export async function seedUserPools(pools) {
  await setResourcePool('availableGovUKUsers', pools.govUKLogin)
  await setResourcePool('availableGovGatewayUsers', pools.govGatewayLogin)
  await setResourcePool(
    'availableMultipleBusinessesGovUKUsers',
    pools.multipleBusinessesGovUKLogin
  )
}

/**
 * Writes FAILED when the run recorded failures. Portal reads this file.
 * @param {{ failed?: number }} [results]
 */
export function writeFailedFile(results) {
  if (results?.failed > 0) {
    fs.writeFileSync('FAILED', JSON.stringify(results))
  }
}
