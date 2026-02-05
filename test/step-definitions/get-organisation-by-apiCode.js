import { Given, When, Then } from '@wdio/cucumber-framework'

Given('a waste receiving organisation is registered', async function () {
  this.organisationId = crypto.randomUUID()
  const response =
    await this.apis.wasteOrganisationBackendAPI.createApiCodeForOrganisation(
      this.organisationId
    )
  expect(response.statusCode).toBe(200)
  this.apiCode = response.json.code
})

When(
  'the get-organisation-by-apiCode endpoint is called with apiCode of above organisation',
  async function () {
    const response =
      await this.apis.wasteOrganisationBackendAPI.getOrganisationByApiCode(
        this.apiCode
      )
    expect(response.statusCode).toBe(200)
    this.defraOrganisationId = response.json.defraOrganisationId
  }
)

Then(
  'defraOrganisationId of the waste receiving organisation must be correctly returned in the response',
  async function () {
    expect(this.defraOrganisationId).toBe(this.organisationId)
  }
)

Then('a not-found response should be returned', async function () {
  expect(this.response.statusCode).toBe(404)
  expect(this.response.json.message).toBe('Not Found')
  expect(this.response.json.error).toBe('Not Found')
})

When(
  'the get-organisation-by-apiCode endpoint is called with a {string} apiCode',
  async function (flag) {
    this.response =
      await this.apis.wasteOrganisationBackendAPI.getOrganisationByApiCode(
        flag === 'disabled' ? this.apiCode : crypto.randomUUID()
      )
  }
)

Given('the apiCode of above organisation is disabled', async function () {
  const response =
    await this.apis.wasteOrganisationBackendAPI.disableApiCodeForOrganisation(
      this.organisationId,
      this.apiCode
    )
  expect(response.statusCode).toBe(200)
})
