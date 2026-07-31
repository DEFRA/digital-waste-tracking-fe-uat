import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'
import LocalAuthorityGuidencePage from '../page-objects/local-authority-guidence.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Given('a user is on are you a local authority page', async function () {
  // Set the pageName on the world object
  this.pageName = 'uk-permit-page'
  await UKPermitPage.open()
  await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  await UKPermitPage.verifyUserIsOnUKPermitPage()
})

When(
  /^user selects the "(Yes|No)" option to indicate they are(| not) a local authority$/,
  async function (option, not) {
    if (option === 'Yes') {
      await UKPermitPage.selectYesOption()
    } else {
      await UKPermitPage.selectNoOption()
    }
  }
)

When(/^user clicks on the "(["A-Za-z\s]+)" button$/, async function (link) {
  if (this.pageName === 'local-authority-guidence-page') {
    await LocalAuthorityGuidencePage.click(
      LocalAuthorityGuidencePage.continueButton
    )
    return
  }
  await UKPermitPage.click(UKPermitPage.continueButton)
})

Then(
  'user should be able to see the guidance for local authorities on the page',
  async function () {
    await LocalAuthorityGuidencePage.verifyLocalAuthorityGuidanceIsDisplayed()
  }
)

Given(
  'a user has indicated that they are a permitted waste receiver',
  async function () {
    this.pageName = 'uk-permit-page'
    await UKPermitPage.open()
    await UKPermitPage.verifyUserIsOnUKPermitPage()
    await UKPermitPage.selectNoOption()
    await UKPermitPage.click(UKPermitPage.continueButton)
    await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
      this.testConfig.defraIdServiceUrl
    )
  }
)
