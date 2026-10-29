import allure from 'allure-commandline'
import {
  initialiseAccessibilityChecking,
  generateAccessibilityReportIndex
} from './test/utils/accessibility-checking.js'
import { readFileSync } from 'fs'
import { setResourcePool, addValueToPool } from '@wdio/shared-store-service'
import { ApiFactory } from './test/utils/apis/api-factory.js'
import { browser } from '@wdio/globals'
import logger from '@wdio/logger'
import {
  addAllureIssueLinksFromPickleTags,
  ALLURE_ISSUE_LINK_TEMPLATE
} from './test/utils/allure-utils.js'
import { buildCucumberTagExpression } from './test/utils/cucumber-tag-expression.js'
const log = logger('wdio.local.grid.conf.js')

/** Cucumber @env_* tag: dev and perf-test scenarios use @env_dev (see wdio.conf.js) */
const cucumberEnvTag =
  process.env.ENVIRONMENT === 'dev' || process.env.ENVIRONMENT === 'perf-test'
    ? 'dev'
    : process.env.ENVIRONMENT

const debug = process.env.DEBUG
const oneMinute = 60 * 1000

const execArgv = ['--loader', 'esm-module-alias/loader']

if (debug) {
  execArgv.push('--inspect')
}

export const config = {
  runner: 'local',
  hostname: process.env.GRID_HOST || '127.0.0.1',
  port: Number(process.env.GRID_PORT) || 4444,
  specs: ['./test/features/**/*.feature'],
  maxInstances: 1,
  capabilities: [
    {
      maxInstances: 1,
      browserName: 'chrome',
      'goog:chromeOptions': {
        args: [
          '--no-sandbox',
          '--disable-infobars',
          '--headless',
          '--disable-gpu',
          '--window-size=1920,1080',
          '--disable-dev-shm-usage'
        ]
      }
    }
  ],

  execArgv,
  logLevel: debug ? 'debug' : 'info',
  logLevels: {
    webdriver: debug ? 'debug' : 'error'
  },
  bail: 0,
  baseUrl:
    process.env.ENVIRONMENT === 'ext-test'
      ? 'https://waste-tracking.integration.defra.gov.uk'
      : `https://waste-organisation-frontend.${process.env.ENVIRONMENT}.cdp-int.defra.cloud`,
  waitforTimeout: 10000,
  waitforInterval: 200,
  connectionRetryTimeout: 60000,
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
    'spec',
    [
      'allure',
      {
        outputDir: 'allure-results',
        issueLinkTemplate: 'https://eaflood.atlassian.net/browse/{}',
        useCucumberStepReporter: true,
        disableWebdriverStepsReporting: false,
        disableWebdriverScreenshotsReporting: false
      }
    ]
  ],

  beforeScenario: async function (world, cucumberWorld) {
    await addAllureIssueLinksFromPickleTags(
      world.pickle,
      ALLURE_ISSUE_LINK_TEMPLATE
    )
    // The world in hooks is not the same object as `this` in step definitions.
    cucumberWorld.pageName = null
    cucumberWorld.tags = world.pickle.tags.map((tag) => tag.name).join(', ')
    cucumberWorld.axeBuilder = null
    cucumberWorld.env = process.env

    const testConfigData = readFileSync(
      `./test/support/${process.env.ENVIRONMENT}.config.json`,
      'utf8'
    )
    cucumberWorld.testConfig = JSON.parse(testConfigData)
    cucumberWorld.apis = ApiFactory.create(
      cucumberWorld.testConfig,
      cucumberWorld.env
    )

    cucumberWorld.apis.govPayAPI.setAuthorizationHeader(
      process.env.GOV_PAY_API_KEY
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
    const defraIdMockUserIds = [
      cucumberWorld.defraIdMockUserId,
      cucumberWorld.differentDefraIdMockUserId
    ].filter(Boolean)
    for (const defraIdMockUserId of defraIdMockUserIds) {
      log.info(
        `cleaning up the user from the defra id mock service: ${defraIdMockUserId}`
      )
      await browser.url(
        `https://cdp-defra-id-stub.${process.env.ENVIRONMENT}.cdp-int.defra.cloud/cdp-defra-id-stub/register/${defraIdMockUserId}/expire`
      )
    }
  },

  onPrepare: async function () {
    if (process.env.ENVIRONMENT === 'test') {
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

  onComplete: function () {
    generateAccessibilityReportIndex()

    const reportError = new Error('Could not generate Allure report')
    const generation = allure(['generate', 'allure-results', '--clean'])

    return new Promise((resolve, reject) => {
      const generationTimeout = setTimeout(() => reject(reportError), oneMinute)

      generation.on('exit', function (exitCode) {
        clearTimeout(generationTimeout)

        if (exitCode !== 0) {
          return reject(reportError)
        }

        allure(['open'])
        resolve()
      })
    })
  }
}
