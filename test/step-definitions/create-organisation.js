import { Then } from '@wdio/cucumber-framework'

Then('next payment period is calculated correctly', async function () {
  const response =
    await this.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
      this.organisationId
    )
  expect(response.statusCode).toBe(200)
  this.nextPaymentPeriod = response.json.organisation.paymentPeriods

  expect(this.nextPaymentPeriod[0].from).toBe(
    process.env.GOVPAY_SERVICE_FREE_PERIOD_END
  )
})

Then(
  'disableAfter attribute must be set to null for the organisation',
  async function () {
    expect(this.disableAfter).toBeNull()
  }
)
