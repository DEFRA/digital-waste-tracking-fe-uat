import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'

Given('a user navigates the home page of DEFRA website', async () => {
  await HomePage.open()
  // await HomePage.waitForPageLoad()
  await expect(HomePage.heading).toBeDisplayed()
  await expect(HomePage.heading).toHaveText(
    'Department\nfor Environment,\nFood & Rural Affairs'
  )
})

When(/^user clicks on the "([A-Za-z]+)" link$/, async (link) => {
  await HomePage.clickLink(HomePage.menuLink)
  await HomePage.takeScreenshot()
})

Then('the user is displayed with super-navigation-section', async () => {
  await expect(HomePage.superNavigationSection).toBeDisplayed()
})

Given('a user navigates to waste receiving website', async () => {
  await HomePage.open()
  // Wait for the page to load
  await HomePage.waitForPageLoad()
  // Optionally take screenshot for debugging
  // await HomePage.takeScreenshot()
})
