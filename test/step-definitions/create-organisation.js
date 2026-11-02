import { Then } from '@wdio/cucumber-framework'

Then(
  'next payment period is calculated correctly',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const response =
      await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
        this.testMemory.organisationId
      )
    expect(response.statusCode).toBe(200)
    this.testMemory.nextPaymentPeriod =
      response.json.organisation.paymentPeriods

    expect(this.testMemory.nextPaymentPeriod[0].from).toBe(
      this.testEnv.govPayServiceFreePeriodEnd
    )
  }
)

Then(
  'disableAfter attribute must be set to null for the organisation',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    expect(this.testMemory.disableAfter).toBeNull()
  }
)
