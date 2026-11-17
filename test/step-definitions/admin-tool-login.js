import { Given, When, Then } from '@wdio/cucumber-framework'
import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { LOGIN_VALIDATION_FIXTURES } from '../data/admin-tool-login-fixtures.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import { getAdminUiCredentials } from '../utils/admin-tool-credentials.js'

const EXAMPLE_PASSWORD = 'example-password'

function getLoginValidationFixture(fixtureKey) {
  const fixture = LOGIN_VALIDATION_FIXTURES[fixtureKey]
  if (!fixture) {
    throw new Error(`Unknown login validation fixture: ${fixtureKey}`)
  }
  return fixture
}

function resolveLoginCredentials(fixture, world) {
  if (!fixture.useConfiguredUsername) {
    return {
      username: fixture.username,
      password: fixture.password
    }
  }

  const username = world.testConfig.adminUiUsername
  if (!username) {
    throw new Error('adminUiUsername is not set in the environment config file')
  }

  return {
    username,
    password: fixture.password
  }
}

Given(
  'the user navigates to the admin tool login page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.open(this.testConfig.adminUiBaseUrl)
    await AdminToolLoginPage.verifyLoginPageIsDisplayed(
      this.testConfig.adminUiBaseUrl
    )
    this.testMemory.pageName = 'admin-tool-login-page'
  }
)

Given(
  'the user has entered a password on the admin tool login page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.enteredPassword = EXAMPLE_PASSWORD
    await AdminToolLoginPage.enterPassword(this.testMemory.enteredPassword)
    await AdminToolLoginPage.verifyPasswordIsHidden(
      this.testMemory.enteredPassword
    )
  }
)

When(
  'the user signs in with valid admin credentials',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const { username, password } = getAdminUiCredentials(this)
    await AdminToolLoginPage.login(username, password)
  }
)

When(
  'the user attempts to sign in with {string} credentials',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getLoginValidationFixture(fixtureKey)
    this.testMemory.loginValidationFixtureKey = fixtureKey

    const { username, password } = resolveLoginCredentials(fixture, this)
    await AdminToolLoginPage.login(username, password)
  }
)

When(
  'the user clicks the show password button',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.clickPasswordVisibilityToggle()
  }
)

When(
  'the user clicks the hide password button',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.clickPasswordVisibilityToggle()
  }
)

Then(
  'the user should be logged in to the admin tool successfully',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.verifyUserIsLoggedIn(
      this.testConfig.adminUiBaseUrl
    )
  }
)

Then(
  'the admin tool login errors for {string} should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = getLoginValidationFixture(fixtureKey)
    await AdminToolLoginPage.verifyLoginErrors({
      expectedSummaryErrors: fixture.expectedSummaryErrors,
      expectInlineErrors: fixture.expectInlineErrors,
      expectedInlineError: fixture.expectedInlineError
    })
  }
)

Then(
  'the waste organisation admin login page should generate accessibility tests',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

Then(
  'the user should remain on the admin tool login page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.verifyStillOnLoginPage(
      this.testConfig.adminUiBaseUrl
    )
  }
)

Then(
  'the entered password should be visible',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.verifyPasswordIsVisible(
      this.testMemory.enteredPassword
    )
  }
)

Then(
  'the entered password should be hidden',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.verifyPasswordIsHidden(
      this.testMemory.enteredPassword
    )
  }
)
