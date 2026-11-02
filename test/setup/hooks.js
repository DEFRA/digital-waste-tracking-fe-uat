import fs from 'node:fs'
import allure from 'allure-commandline'
import AllureReporter, { addStep } from '@wdio/allure-reporter'
import { browser } from '@wdio/globals'
import logger from '@wdio/logger'
import { addValueToPool, setResourcePool } from '@wdio/shared-store-service'
import { ApiFactory } from '../utils/apis/api-factory.js'
import {
  ALLURE_ISSUE_LINK_TEMPLATE,
  addAllureIssueLinksFromPickleTags
} from '../utils/allure-utils.js'
import {
  generateAccessibilityReportIndex,
  initialiseAccessibilityChecking
} from '../utils/accessibility-checking.js'
import { TestConfig } from './test-config.js'
import { TestMemory } from './test-memory.js'
import { openZapSession, publishZapReports } from './zap-reports.js'

const log = logger('wdio-hooks')

/**
 * @param {{ driver: 'grid'|'local'|'browserstack', testEnv: import('./test-env.js').TestEnv, testConfig: TestConfig }} options
 */
export function createHooks({ driver, testEnv, testConfig }) {
  const browserstack = driver === 'browserstack'
  const writeFailedFile = driver === 'grid' || browserstack
  let scenarioSeen = false

  return {
    /**
     * @param {import('../types/globals.js').CucumberWorld} cucumberWorld
     */
    beforeScenario: async function (world, cucumberWorld) {
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

      if (browserstack) {
        const capabilities = await browser.capabilities
        const requestedBstackOptions =
          browser.options.capabilities?.['bstack:options'] ?? {}
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
      } else {
        const capabilities = browser.capabilities
        testMemory.browserInfo =
          `${capabilities.browserName ?? ''} ${capabilities.browserVersion ?? ''}`.trim()
        testMemory.deviceInfo =
          capabilities.deviceName ??
          `OS: ${capabilities.platformName ?? 'local'}`
      }

      if (scenarioSeen && browser.sessionId) {
        await browser.reloadSession()
      }
      scenarioSeen = true
    },

    afterStep: async function (_step, _scenario, result) {
      if (result.passed !== false && !result.error) return
      try {
        await browser.takeScreenshot()
      } catch (error) {
        log.warn(`afterStep: screenshot failed — ${error.message}`)
      }
    },

    /**
     * @param {import('../types/globals.js').CucumberWorld} cucumberWorld
     */
    afterScenario: async function (_world, result, cucumberWorld) {
      const testMemory = cucumberWorld.testMemory
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
        addStep(
          `adding gov gateway user ${testMemory.govGatewayUser} to the pool`
        )
        await addValueToPool(
          'availableGovGatewayUsers',
          testMemory.govGatewayUser
        )
      }
      if (testMemory.multipleBusinessesGovUKUser !== undefined) {
        await addValueToPool(
          'availableMultipleBusinessesGovUKUsers',
          testMemory.multipleBusinessesGovUKUser
        )
      }
      if (browserstack) {
        if (testMemory.govUKUser !== undefined) {
          await addValueToPool('availableUsers', testMemory.govUKUser)
        }
        if (testMemory.govGatewayUser !== undefined) {
          await addValueToPool('availableUsers', testMemory.govGatewayUser)
        }
      }

      if (result.passed === false || result.error) {
        try {
          await browser.takeScreenshot()
        } catch (error) {
          log.warn(`afterScenario: screenshot failed — ${error.message}`)
        }
      }

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
          log.warn(
            `afterScenario: defraId expireUser failed — ${error.message}`
          )
        }
      }
    },

    onPrepare: async function () {
      if (testEnv.environment === 'test') {
        const pools = new TestConfig('test')
        await setResourcePool('availableGovUKUsers', pools.govUKLogin)
        await setResourcePool('availableGovGatewayUsers', pools.govGatewayLogin)
        await setResourcePool(
          'availableMultipleBusinessesGovUKUsers',
          pools.multipleBusinessesGovUKLogin
        )
        if (browserstack) {
          const users = pools.govUKLogin
            .concat(pools.govGatewayLogin)
            .sort(() => Math.random() - 0.5)
          await setResourcePool('availableUsers', users)
        }
      }
      await openZapSession(testEnv, testConfig)
    },

    onComplete: async function (_exitCode, _config, _capabilities, results) {
      if (driver === 'grid') generateAccessibilityReportIndex()
      if (writeFailedFile && results?.failed > 0) {
        fs.writeFileSync('FAILED', JSON.stringify(results))
      }
      await publishZapReports(testEnv)
    }
  }
}

/**
 * Local Chrome and the grid open the Allure report after the run.
 */
export function openAllureReport() {
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
