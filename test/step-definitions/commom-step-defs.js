import { Then } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import UploadSuccessfulPage from '../page-objects/upload-successful.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import ConfirmDisableApiCodePage from '../page-objects/confirm-disable-api-code.page.js'

Then(
  /^(the )?user should be redirected to "([a-zA-Z0-9\-\s]+)" page(| of that business| of that new business)$/,
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
        this.pageName = 'upload-successful-page'
        this.organisationId =
          await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage()
        break
      case 'Spreadsheet update successful':
        this.pageName = 'spreadsheet-update-successful-page'
        this.organisationId =
          await UploadSuccessfulPage.verifyUserIsOnUploadSuccessfulPage(
            'update'
          )
        break
      case 'Confirm disable API code':
        this.pageName = 'confirm-disable-api-code-page'
        await ConfirmDisableApiCodePage.verifyUserIsOnConfirmDisableApiCodePage(
          this.activeApiCode
        )
        break
    }
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)
