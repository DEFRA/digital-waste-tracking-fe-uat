import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'
import CannotUseServicePage from '../page-objects/cannot-use-service.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Given(
  'a user is on are you a permitted waste receiver page',
  async function () {
    // Set the pageName on the world object
    this.pageName = 'uk-permit-page'
    await UKPermitPage.open()
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    await UKPermitPage.verifyUserIsOnUKPermitPage()
  }
)

When(
  /^user selects the "(Yes|No)" option to indicate they are(| not) a permitted waste receiver$/,
  async function (option, not) {
    if (option === 'Yes') {
      await UKPermitPage.selectYesOption()
    } else {
      await UKPermitPage.selectNoOption()
    }
  }
)

When(/^user clicks on the "(["A-Za-z\s]+)" button$/, async function (link) {
  await UKPermitPage.click(UKPermitPage.continueButton)
})

Then(
  'user should be redirected to "Sorry, you cannot use the service" page',
  async function () {
    this.pageName = 'cannot-use-service-page'
    await CannotUseServicePage.verifyUserIsOnCannotUseServicePage()
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

Then(
  'user should be presented with an error message as below',
  async function (dataTable) {
    this.pageName = 'uk-permit-error-page'
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    const rows = dataTable.hashes()
    // Verify the error message is displayed on the page
    await UKPermitPage.verifyErrorMessage(rows[0].message)
  }
)

Given(
  'a user has indicated that they are a permitted waste receiver',
  async function () {
    this.pageName = 'uk-permit-page'
    await UKPermitPage.open()
    await UKPermitPage.verifyUserIsOnUKPermitPage()
    await UKPermitPage.selectYesOption()
    await UKPermitPage.click(UKPermitPage.continueButton)
    await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
      this.testConfig.defraIdServiceUrl
    )
  }
)
