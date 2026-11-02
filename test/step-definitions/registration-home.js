import { Given, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Given(
  'a user is on Report of waste registration start page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    // Set the pageName on the world object
    this.testMemory.pageName = 'start-page'
    await HomePage.open()
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
    await HomePage.verifyUserIsOnHomePage()
  }
)

Then(
  'user should be redirected to Defra Id service',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
      this.testConfig.defraIdServiceUrl
    )
    // await DefraId.verifyUserIsOnDefraIdChooseSignInPage()
  }
)
