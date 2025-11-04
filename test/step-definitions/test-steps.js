import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'

Given('a user navigates the home page of DEFRA website', async () => {
  await HomePage.open()
  await HomePage.verifyUserIsOnHomePage()
})

When(/^user clicks on the "([A-Za-z\s]+)" link$/, async (link) => {
  if (link === 'Menu') {
    await HomePage.clickLink(HomePage.menuLink)
  } else {
    await HomePage.clickOnLinkWithText(link)
  }
})

Then('the user is displayed with super-navigation-section', async () => {
  await HomePage.verifySuperNavigationSectionIsDisplayed()
})

Then(
  /^the user is navigated to the "([A-Za-z\s\-/]+)" page$/,
  async (expectedUrl) => {
    await HomePage.verifyUserNavigatedCorrectlyToTargetPage(expectedUrl)
  }
)
