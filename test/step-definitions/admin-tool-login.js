import { Given, Then } from '@wdio/cucumber-framework'
import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { signInIfAsked } from '../utils/sign-in-to-admin-tool.js'

Given(
  'the user opens the admin tool',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.open(this.testConfig.adminUiBaseUrl)
    await signInIfAsked(this)
  }
)

Then(
  'the user should be signed in to the admin tool',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await AdminToolLoginPage.verifyUserIsSignedIn(
      this.testConfig.adminUiBaseUrl
    )
  }
)
