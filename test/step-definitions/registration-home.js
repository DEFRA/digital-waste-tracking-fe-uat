import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Given(
  'a user is on Report of waste registration start page',
  async function () {
    // Set the pageName on the world object
    this.pageName = 'start-page'
    await HomePage.open()

    if (this.tags.includes('@accessibility')) {
      await analyseAccessibility(this.axeBuilder, this.pageName)
    }

    await HomePage.verifyUserIsOnHomePage()
  }
)

When(/^user clicks on the "(["A-Za-z\s]+)" button$/, async function (link) {
  await HomePage.click(HomePage.startNowButton)
})

Then('user should be redirected to Defra Id service', async function () {
  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    this.testConfig.defraIdServiceUrl
  )
  // await DefraId.verifyUserIsOnDefraIdChooseSignInPage()
})
