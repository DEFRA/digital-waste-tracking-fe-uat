import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { getAdminUiCredentials } from './admin-tool-credentials.js'

/**
 * Signs in with Entra ID when the browser is sent to login.microsoftonline.com.
 * Local Docker and the admin UI CI are already signed in, so this returns.
 *
 * @param {import('../types/globals.js').CucumberWorld} world
 */
export async function signInIfAsked(world) {
  const baseUrl = world.testConfig.adminUiBaseUrl
  await AdminToolLoginPage.waitUntilSettled(baseUrl)
  if (!(await AdminToolLoginPage.isOnEntra())) return

  const { username, password } = getAdminUiCredentials(world)
  await AdminToolLoginPage.signInWithEntra(username, password, baseUrl)
}
