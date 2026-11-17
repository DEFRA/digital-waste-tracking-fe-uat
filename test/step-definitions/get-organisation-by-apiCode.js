import { Given, When, Then } from '@wdio/cucumber-framework'

Given(
  'a waste receiving organisation is registered',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.organisationId = crypto.randomUUID()
    const response =
      await this.testMemory.apis.wasteOrganisationBackendAPI.createOrganisation(
        this.testMemory.organisationId
      )
    expect(response.statusCode).toBe(200)
    if (response.json.code === undefined) {
      const response1 =
        await this.testMemory.apis.wasteOrganisationBackendAPI.createApiCodeForOrganisation(
          this.testMemory.organisationId
        )
      expect(response1.statusCode).toBe(200)
      this.testMemory.apiCode = response1.json.code
    } else {
      this.testMemory.apiCode = response.json.code
    }
    this.testMemory.disableAfter = response.json.organisation.disableAfter
  }
)

When(
  'the get-organisation-by-apiCode endpoint is called with apiCode of above organisation',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const response =
      await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationByApiCode(
        this.testMemory.apiCode
      )
    this.testMemory.response = response
  }
)

Then(
  'defraOrganisationId of the waste receiving organisation must be correctly returned in the response',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    expect(this.testMemory.response.statusCode).toBe(200)
    expect(this.testMemory.response.json.metaData.disableAfter).toBe(
      this.testMemory.organisationDisableAfter
    )
    this.testMemory.defraOrganisationId =
      this.testMemory.response.json.defraCustomerOrganisationId
    expect(this.testMemory.defraOrganisationId).toBe(
      this.testMemory.organisationId
    )
  }
)

Then(
  'a not-found response should be returned',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    expect(this.testMemory.response.statusCode).toBe(404)
    expect(this.testMemory.response.json.message).toBe('Not Found')
    expect(this.testMemory.response.json.error).toBe('Not Found')
  }
)

When(
  'the get-organisation-by-apiCode endpoint is called with a {string} apiCode',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    flag
  ) {
    this.testMemory.response =
      await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationByApiCode(
        flag === 'disabled' ? this.testMemory.apiCode : crypto.randomUUID()
      )
  }
)

Given(
  'the apiCode of above organisation is disabled',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const response =
      await this.testMemory.apis.wasteOrganisationBackendAPI.disableApiCodeForOrganisation(
        this.testMemory.organisationId,
        this.testMemory.apiCode
      )
    expect(response.statusCode).toBe(200)
  }
)

Given(
  /^the service charge is( not)? due for the organisation$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    flag
  ) {
    const oneYearFromNow = new Date()
    if (flag && flag.includes('not')) {
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() + 1)
      this.testMemory.organisationDisableAfter = oneYearFromNow.toISOString()
    } else {
      oneYearFromNow.setFullYear(oneYearFromNow.getFullYear() - 1)
      this.testMemory.organisationDisableAfter = oneYearFromNow.toISOString()
    }

    const response =
      await this.testMemory.apis.wasteOrganisationBackendAPI.updateOrganisationDetails(
        this.testMemory.organisationId,
        {
          organisation: {
            disableAfter: oneYearFromNow.toISOString()
          }
        }
      )
    expect(response.statusCode).toBe(200)
  }
)

Then(
  'a payment required error response should be returned',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    expect(this.testMemory.response.statusCode).toBe(402)
    expect(this.testMemory.response.json.message).toBe('Payment Required')
    expect(this.testMemory.response.json.error).toBe('Payment Required')
  }
)
