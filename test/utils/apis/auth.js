/**
 * Helper function to authenticate with Cognito OAuth and set the auth token
 * @param {string} clientId - The Cognito client ID
 * @param {string} clientSecret - The Cognito client secret
 * @returns {Promise<Object>} The authentication response
 */
async function authenticateAndSetToken(clientOAuthApi, clientId, clientSecret) {
  const authResponse = await clientOAuthApi.authenticate(clientId, clientSecret)
  expect(authResponse.statusCode).toBe(200)
  expect(authResponse.json).toHaveProperty('access_token')

  return authResponse
}

export { authenticateAndSetToken }
