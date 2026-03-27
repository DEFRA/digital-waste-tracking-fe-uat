import { Then } from '@wdio/cucumber-framework'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import NextActionPage from '../page-objects/next-action.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import ConfirmDisableApiCodePage from '../page-objects/confirm-disable-api-code.page.js'
import CannotUseServicePage from '../page-objects/cannot-use-service.page.js'
import UserNotAuthenticatedPage from '../page-objects/user-not-authenticated.page.js'
import AllureReporter from '@wdio/allure-reporter'

Then(
  /^(the )?user should be redirected to "([a-zA-Z0-9\-\s,]+)" page(| of that business| of that new business)$/,
  async function (x, pageString, y) {
    switch (pageString) {
      case 'account-home':
        this.pageName = 'account-home-page'
        await MyAccountHomePage.verifyUserIsOnMyAccountHomePage(
          this.selectedOrganisation
        )
        break
      case 'Report receipt of waste':
        this.pageName = 'report-receipt-of-waste-page'
        await NextActionPage.verifyUserIsOnChooseNextActionPage()
        break
      case 'Upload successful':
        if (
          !this.deviceInfo.includes('Samsung Galaxy') &&
          (this.browserInfo.includes('chrome') ||
            this.browserInfo.includes('MicrosoftEdge'))
        ) {
          this.pageName = 'upload-successful-page'
          const { organisationId, referenceNumber } =
            await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage()
          this.organisationId = organisationId
          this.uploadId = referenceNumber
        } else {
          AllureReporter.addStep(
            `⚠️ Skipped due to test limitation: file upload is not supported for non-Chromium browser (${this.browserInfo}) — browser.uploadFile() is Chromium-only`,
            {},
            'skipped'
          )
        }
        break
      case 'Spreadsheet update successful':
        if (
          !this.deviceInfo.includes('Samsung Galaxy') &&
          (this.browserInfo.includes('chrome') ||
            this.browserInfo.includes('MicrosoftEdge'))
        ) {
          this.pageName = 'spreadsheet-update-successful-page'
          const { organisationId, referenceNumber } =
            await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage(
              'update'
            )
          this.organisationId = organisationId
          this.uploadId = referenceNumber
        } else {
          AllureReporter.addStep(
            `⚠️ Skipped due to test limitation: file upload is not supported for non-Chromium browser (${this.browserInfo}) — browser.uploadFile() is Chromium-only`,
            {},
            'skipped'
          )
        }
        break
      case 'Confirm disable API code':
        this.pageName = 'confirm-disable-api-code-page'
        await ConfirmDisableApiCodePage.verifyUserIsOnConfirmDisableApiCodePage(
          this.activeApiCode
        )
        break
      case 'Sorry, you cannot use the service':
        this.pageName = 'cannot-use-service-page'
        await CannotUseServicePage.verifyUserIsOnCannotUseServicePage()
        break
      case 'You do not have permission to view this page':
        this.pageName = 'user-not-authenticated-page'
        await UserNotAuthenticatedPage.verifyUserIsOnUserNotAuthenticatedPage()
        break
    }
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)
