import { Given } from '@wdio/cucumber-framework'

Given('a waste receiving organisation is registered', async function () {
  const response =
    await this.apis.wasteOrganisationBackendAPI.createApiCodeForOrganisation(
      crypto.randomUUID()
    )
  expect(response.statusCode).toBe(200)
  this.apiCode = response.json.code
  // console.log(this.apiCode)
})
