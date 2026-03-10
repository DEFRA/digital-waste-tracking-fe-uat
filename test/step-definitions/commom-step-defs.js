import { Then } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Then('user is redirected to {string} page', async function (pageString) {
  if (pageString === 'account-home') {
    this.pageName = 'account-home-page'
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  } else if (pageString === 'Report receipt of waste') {
    this.pageName = 'report-receipt-of-waste-page'
    await NextActionPage.verifyUserIsOnChooseNextActionPage()
  }
  await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
})
