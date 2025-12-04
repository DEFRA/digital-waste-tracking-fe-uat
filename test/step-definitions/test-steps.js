import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import { analyseAccessibility } from '../accessibility-checking.js'

Given('a user navigates the home page of DEFRA website', async function () {
  // Set the pageName on the world object
  this.pageName = 'start-page'
  await HomePage.open()

  // ToDo: Check if the page is not already analysed
  if (this.tags.includes('@accessibility')) {
    await analyseAccessibility(this.axeBuilder,this.pageName)
  }

  // await HomePage.verifyUserIsOnHomePage()
})

When(/^user clicks on the "([A-Za-z\s]+)" link$/, async function (link) {
  if (link === 'Menu') {
    await HomePage.clickLink(HomePage.menuLink)
  } else {
    await HomePage.clickOnLinkWithText(link)
  }
})

Then('the user is displayed with super-navigation-section', async function () {
  await HomePage.verifySuperNavigationSectionIsDisplayed()
})

Then(
  /^the user is navigated to the "([A-Za-z\s\-/]+)" page$/,
  async function (expectedUrl) {
    await HomePage.verifyUserNavigatedCorrectlyToTargetPage(expectedUrl)
  }
)
