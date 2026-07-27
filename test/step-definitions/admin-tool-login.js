import { Given, When, Then } from '@wdio/cucumber-framework'
import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { LOGIN_VALIDATION_FIXTURES } from '../data/admin-tool-login-fixtures.js'
import { getAdminUiCredentials } from '../utils/admin-tool-credentials.js'

const EXAMPLE_PASSWORD = 'example-password'

function getLoginValidationFixture(fixtureKey) {
  const fixture = LOGIN_VALIDATION_FIXTURES[fixtureKey]
  if (!fixture) {
    throw new Error(`Unknown login validation fixture: ${fixtureKey}`)
  }
  return fixture
}

function resolveLoginCredentials(fixture, testConfig) {
  if (!fixture.useConfiguredUsername) {
    return {
      username: fixture.username,
      password: fixture.password
    }
  }

  const username = testConfig.adminUiUsername
  if (!username) {
    throw new Error('adminUiUsername is not set in the environment config file')
  }

  return {
    username,
    password: fixture.password
  }
}

Given('the user navigates to the admin tool login page', async function () {
  await AdminToolLoginPage.open(this.testConfig.adminUiBaseUrl)
  await AdminToolLoginPage.verifyLoginPageIsDisplayed(
    this.testConfig.adminUiBaseUrl
  )
})

Given(
  'the user has entered a password on the admin tool login page',
  async function () {
    this.enteredPassword = EXAMPLE_PASSWORD
    await AdminToolLoginPage.enterPassword(this.enteredPassword)
    await AdminToolLoginPage.verifyPasswordIsHidden(this.enteredPassword)
  }
)

When('the user signs in with valid admin credentials', async function () {
  const { username, password } = getAdminUiCredentials(
    this.testConfig,
    this.env
  )
  await AdminToolLoginPage.login(username, password)
})

When(
  'the user attempts to sign in with {string} credentials',
  async function (fixtureKey) {
    const fixture = getLoginValidationFixture(fixtureKey)
    this.loginValidationFixtureKey = fixtureKey

    const { username, password } = resolveLoginCredentials(
      fixture,
      this.testConfig
    )
    await AdminToolLoginPage.login(username, password)
  }
)

When('the user clicks the show password button', async function () {
  await AdminToolLoginPage.clickPasswordVisibilityToggle()
})

When('the user clicks the hide password button', async function () {
  await AdminToolLoginPage.clickPasswordVisibilityToggle()
})

Then(
  'the user should be logged in to the admin tool successfully',
  async function () {
    await AdminToolLoginPage.verifyUserIsLoggedIn(
      this.testConfig.adminUiBaseUrl
    )
  }
)

Then(
  'the admin tool login errors for {string} should be displayed',
  async function (fixtureKey) {
    const fixture = getLoginValidationFixture(fixtureKey)
    await AdminToolLoginPage.verifyLoginErrors({
      expectedSummaryErrors: fixture.expectedSummaryErrors,
      expectInlineErrors: fixture.expectInlineErrors,
      expectedInlineError: fixture.expectedInlineError
    })
  }
)

Then('the user should remain on the admin tool login page', async function () {
  await AdminToolLoginPage.verifyStillOnLoginPage(
    this.testConfig.adminUiBaseUrl
  )
})

Then('the entered password should be visible', async function () {
  await AdminToolLoginPage.verifyPasswordIsVisible(this.enteredPassword)
})

Then('the entered password should be hidden', async function () {
  await AdminToolLoginPage.verifyPasswordIsHidden(this.enteredPassword)
})
