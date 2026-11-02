import { Given, Then, When } from '@cucumber/cucumber'
import TermsPage from '../page-objects/terms.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import CookiesPage from '../page-objects/cookies.page.js'

Then(
  'the user should see a beta banner and a feedback survey link',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await this.testMemory.currentPage.verifyBetaBannerIsDisplayed()
    await this.testMemory.currentPage.verifyFeedbackLinkIsDisplayed()
  }
)

When(
  'the user clicks on the feedback survey link on the beta banner',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await this.testMemory.currentPage.clickFeedbackLink()
  }
)

Then(
  'the feedback form should open in a new tab',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await this.testMemory.currentPage.verifyFeedbackFormOpenedInNewTab()
  }
)

When(
  'the user clicks on the {string} link in the footer',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    footerLinkText
  ) {
    await this.testMemory.currentPage.clickLinkInFooter(footerLinkText)
  }
)

Then(
  'the user should be able to see the Access declaration in T&Cs',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await TermsPage.verifyAccessDeclarationInTAndCs()
  }
)

Given(
  'the user signs out of his existing session',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await MyAccountHomePage.clickSignOutLink()
    await MyAccountHomePage.verifyUserIsSignedOut()
  }
)

Then(
  'the user should be able to see information about how cookies are used',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await CookiesPage.verifyCookiesInformationIsDisplayed()
  }
)
