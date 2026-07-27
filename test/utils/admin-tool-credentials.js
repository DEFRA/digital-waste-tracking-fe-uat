export function getAdminUiCredentials(testConfig, env) {
  const username = testConfig.adminUiUsername
  const password = env.adminUiPassword

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
