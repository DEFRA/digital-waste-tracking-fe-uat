import { Given, When, Then } from '@wdio/cucumber-framework'

Given('a waste receiving organisation is registered', async function () {
  this.organisationId = crypto.randomUUID()
  const response =
    await this.apis.wasteOrganisationBackendAPI.createOrganisation(
      this.organisationId
    )
  expect(response.statusCode).toBe(200)
  if (response.json.code === undefined) {
    const response1 =
      await this.apis.wasteOrganisationBackendAPI.createApiCodeForOrganisation(
        this.organisationId
      )
    expect(response1.statusCode).toBe(200)
    this.apiCode = response1.json.code
  } else {
    this.apiCode = response.json.code
  }
  this.disableAfter = response.json.organisation.disableAfter
})

When(
  'the get-organisation-by-apiCode endpoint is called with apiCode of above organisation',
  async function () {
    const response =
      await this.apis.wasteOrganisationBackendAPI.getOrganisationByApiCode(
        this.apiCode
      )
    this.response = response
  }
)

Then(
  'defraOrganisationId of the waste receiving organisation must be correctly returned in the response',
  async function () {
    expect(this.response.statusCode).toBe(200)
    expect(this.response.json.metaData.disableAfter).toBe(
      this.organisationDisableAfter
    )
    this.defraOrganisationId = this.response.json.defraCustomerOrganisationId
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

Given(
  /^the service charge is( not)? due for the organisation$/,
  async function (flag) {
    const oneYearFromNow = new Date()
    if (flag && flag.includes('not')) {
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      this.organisationDisableAfter = oneYearFromNow.toISOString()
    } else {
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1)
      this.organisationDisableAfter = oneYearFromNow.toISOString()
    }

    const response =
      await this.apis.wasteOrganisationBackendAPI.updateOrganisationDetails(
        this.organisationId,
        {
          organisation: {
            disableAfter: oneYearFromNow.toISOString()
          }
        }
      )
    expect(response.statusCode).toBe(200)
  }
)

Then('a payment required error response should be returned', async function () {
  expect(this.response.statusCode).toBe(402)
  expect(this.response.json.message).toBe('Payment Required')
  expect(this.response.json.error).toBe('Payment Required')
})
