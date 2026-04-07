import NextActionPage from '../page-objects/next-action.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import ConfirmDisableApiCodePage from '../page-objects/confirm-disable-api-code.page.js'
import CannotUseServicePage from '../page-objects/cannot-use-service.page.js'
import UserNotAuthenticatedPage from '../page-objects/user-not-authenticated.page.js'
import PrivacyNoticePage from '../page-objects/privacy-notice.page.js'
import CannotContinueOnThisServicePage from '../page-objects/cannot-continue-on-this-service.page.js'
import AllureReporter from '@wdio/allure-reporter'

function isChromiumDesktop(context) {
  return (
    !context.deviceInfo.includes('Samsung Galaxy') &&
    (context.browserInfo.includes('chrome') ||
      context.browserInfo.includes('MicrosoftEdge'))
  )
}

function skipNonChromium(context) {
  AllureReporter.addStep(
    `⚠️ Skipped due to test limitation: file upload is not supported for non-Chromium browser (${context.browserInfo}) — browser.uploadFile() is Chromium-only`,
    {},
    'skipped'
  )
}

/**
 * Registry of page verifications keyed by the page string used in feature files.
 * Each entry is: { pageName: string, verify: async (context) => void }
 *
 * To add a new page, add a new entry here — no other file needs changing.
 */
export const PAGE_REGISTRY = new Map([
  [
    'You cannot continue on this service',
    {
      pageName: 'cannot-continue-on-this-service-page',
      verify: async () => {
        await CannotContinueOnThisServicePage.verifyUserIsOnCannotContinueOnThisServicePage()
      }
    }
  ],
  [
    'privacy-notice',
    {
      pageName: 'privacy-notice-page',
      verify: async () => {
        await PrivacyNoticePage.verifyUserIsOnPrivacyNoticePage()
      }
    }
  ],
  [
    'account-home',
    {
      pageName: 'account-home-page',
      verify: async (context) => {
        await MyAccountHomePage.verifyUserIsOnMyAccountHomePage(
          context.selectedOrganisation
        )
      }
    }
  ],
  [
    'Report receipt of waste',
    {
      pageName: 'report-receipt-of-waste-page',
      verify: async () => {
        await NextActionPage.verifyUserIsOnChooseNextActionPage()
      }
    }
  ],
  [
    'Upload successful',
    {
      pageName: 'upload-successful-page',
      verify: async (context) => {
        if (!isChromiumDesktop(context)) {
          skipNonChromium(context)
          return
        }
        const { organisationId, referenceNumber } =
          await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage()
        context.organisationId = organisationId
        context.referenceNumber = referenceNumber
      }
    }
  ],
  [
    'Spreadsheet update successful',
    {
      pageName: 'spreadsheet-update-successful-page',
      verify: async (context) => {
        if (!isChromiumDesktop(context)) {
          skipNonChromium(context)
          return
        }
        const { organisationId, referenceNumber } =
          await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage(
            'update'
          )
        context.organisationId = organisationId
        context.referenceNumber = referenceNumber
      }
    }
  ],
  [
    'Confirm disable API code',
    {
      pageName: 'confirm-disable-api-code-page',
      verify: async (context) => {
        await ConfirmDisableApiCodePage.verifyUserIsOnConfirmDisableApiCodePage(
          context.activeApiCode
        )
      }
    }
  ],
  [
    'Sorry, you cannot use the service',
    {
      pageName: 'cannot-use-service-page',
      verify: async () => {
        await CannotUseServicePage.verifyUserIsOnCannotUseServicePage()
      }
    }
  ],
  [
    'You do not have permission to view this page',
    {
      pageName: 'user-not-authenticated-page',
      verify: async () => {
        await UserNotAuthenticatedPage.verifyUserIsOnUserNotAuthenticatedPage()
      }
    }
  ]
])
