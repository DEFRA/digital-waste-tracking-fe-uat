import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { getAdminUiCredentials } from './admin-tool-credentials.js'

/**
 * Signs in with a username and password if the admin tool asks for them.
 *
 * Once the admin tool signs in with Entra ID (DWTSPI-531), opening a page signs
 * the user in without asking, as floci-az does locally. Until then it shows its
 * login form. This works either way, so neither has to wait for the other.
 *
 * @param {import('../types/globals.js').CucumberWorld} world
 */
export async function signInIfAsked(world) {
  if (!(await AdminToolLoginPage.isAskingForPassword())) {
    return
  }

  await AdminToolLoginPage.verifyPageIsDisplayed(world.testEnv.environment)

  const { username, password } = getAdminUiCredentials(world)
  await AdminToolLoginPage.login(username, password)
}
