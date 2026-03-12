import { Then } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Then(
  /^(the ?)user is redirected to "([a-zA-Z0-9\-\s]+)" page(| of that business| of that new business)$/,
  async function (x, pageString, y) {
    if (pageString === 'account-home') {
      this.pageName = 'account-home-page'
      await MyAccountHomePage.verifyUserIsOnMyAccountHomePage(
        this.selectedOrganisation
      )
    } else if (pageString === 'Report receipt of waste') {
      this.pageName = 'report-receipt-of-waste-page'
      await NextActionPage.verifyUserIsOnChooseNextActionPage()
    }
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)
