import { Given, Then, When } from '@cucumber/cucumber'
import TermsPage from '../page-objects/terms.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'

Then(
  'the user should see a beta banner and a feedback survey link',
  async function () {
    await this.currentPage.verifyBetaBannerIsDisplayed()
    await this.currentPage.verifyFeedbackLinkIsDisplayed()
  }
)

When(
  'the user clicks on the feedback survey link on the beta banner',
  async function () {
    await this.currentPage.clickFeedbackLink()
  }
)

Then('the feedback form should open in a new tab', async function () {
  await this.currentPage.verifyFeedbackFormOpenedInNewTab()
})

When(
  'the user clicks on the {string} link in the footer',
  async function (footerLinkText) {
    await this.currentPage.clickLinkInFooter(footerLinkText)
  }
)

Then(
  'the user should be able to see the Access declaration in T&Cs',
  async function () {
    await TermsPage.verifyAccessDeclarationInTAndCs()
  }
)

Given('the user signs out of his existing session', async function () {
  await MyAccountHomePage.clickSignOutLink()
  await MyAccountHomePage.verifyUserIsSignedOut()
})
