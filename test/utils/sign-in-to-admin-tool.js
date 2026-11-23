import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { getAdminUiCredentials } from './admin-tool-credentials.js'

/**
 * Signs in when the admin tool asks. Once it has its own sign in page
 * (DWTSPI-532), that comes first, and "Continue to sign in" goes on to Entra ID.
 * On CDP, Entra ID is login.microsoftonline.com, which needs the email and
 * password. Locally and in the admin UI CI, floci-az signs in without asking.
 *
 * @param {import('../types/globals.js').CucumberWorld} world
 */
export async function signInIfAsked(world) {
  const baseUrl = world.testConfig.adminUiBaseUrl
  await AdminToolLoginPage.waitUntilSettled(baseUrl)
  // The admin tool's own sign in page comes first, once it has one
  if (await AdminToolLoginPage.continueToSignInIfAsked(baseUrl)) {
    await AdminToolLoginPage.waitUntilSettled(baseUrl)
  }
  if (!(await AdminToolLoginPage.isOnEntra())) return

  const { username, password } = getAdminUiCredentials(world)
  await AdminToolLoginPage.signInWithEntra(username, password, baseUrl)
}
