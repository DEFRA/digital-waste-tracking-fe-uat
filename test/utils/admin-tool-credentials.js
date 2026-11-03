/**
 * @param {import('../types/globals.js').CucumberWorld} world
 */
export function getAdminUiCredentials(world) {
  const username = world.testConfig.adminUiUsername
  const password = world.testEnv.adminUiPassword

  if (!username) {
    throw new Error('adminUiUsername is not set in the environment config file')
  }

  if (!password) {
    throw new Error(
      'adminUiPassword is not set. Add export adminUiPassword=<value> to env.sh'
    )
  }

  return { username, password }
}
