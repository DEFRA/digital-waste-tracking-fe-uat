import PayServiceChargePage from '../page-objects/pay-service-charge.page.js'
import ReviewServiceChargePage from '../page-objects/review-service-charge.page.js'
import { When, Then } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import AllureReporter from '@wdio/allure-reporter'
import GovPayPage from '../page-objects/gov-pay.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import ServiceChargePaymentDetailsPage from '../page-objects/service-charge-payment-details.page.js'

When('the user continues to pay the service charge', async function () {
  await PayServiceChargePage.continueToPayServiceCharge()
})

When('user cancels the pay service charge', async function () {
  await PayServiceChargePage.cancelPayServiceCharge()
})

When(
  'the user allowed to review the service charge details',
  async function () {
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      process.env.GOVPAY_SERVICE_FREE_PERIOD_END
    )
  }
)

When('user cancels the review service charge', async function () {
  await ReviewServiceChargePage.cancelReviewServiceCharge()
})

When('the next payment due is available to pay now', async function () {
  const disableAfter = new Date()
  disableAfter.setUTCMonth(disableAfter.getUTCMonth() + 1, 1)
  disableAfter.setUTCHours(0, 0, 0, 0)
  this.serviceChargeDueDate = disableAfter.toISOString()

  const response =
    await this.apis.wasteOrganisationBackendAPI.updateOrganisationDetails(
      this.organisationId,
      {
        organisation: {
          disableAfter: this.serviceChargeDueDate
        }
      }
    )
  expect(response.statusCode).toBe(200)

  const organisationDetails =
    await this.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
      this.organisationId,
      this.defraIdMockUserId
    )
  expect(organisationDetails.statusCode).toBe(200)

  const paymentPeriods =
    organisationDetails.json.organisation.paymentPeriods ?? []
  if (paymentPeriods.length === 0) {
    throw new Error('Payment periods were not available for the organisation')
  }

  await MyAccountHomePage.open()
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
})

When('the service charge has already been paid', async function (dataTable) {
  const paymentDetails = dataTable.rowsHash()

  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()

  await PayServiceChargePage.open()
  await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
  await PayServiceChargePage.continueToPayServiceCharge()
  await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
    process.env.GOVPAY_SERVICE_FREE_PERIOD_END
  )
  await ReviewServiceChargePage.continueToMakePayment()

  const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
  this.uniquePaymentReference = uniquePaymentReference
  await GovPayPage.submitCardDetails(paymentDetails.card_number)
  await GovPayPage.verifyUserIsOnGovPayConfirmPage(uniquePaymentReference)
  await GovPayPage.confirmPayment()

  await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargePaymentDetailsPage()

  let json
  await browser.waitUntil(
    async () => {
      const response = await this.apis.govPayAPI.getPaymentStatus(
        uniquePaymentReference
      )
      json = response.json

      return json?.state?.status === 'success' && json.state.finished === true
    },
    {
      timeout: 30000,
      interval: 3000,
      timeoutMsg: `Payment "${uniquePaymentReference}" was not successful within 30s`
    }
  )

  expect(json.state.status).toBe('success')
  expect(json.state.finished).toBe(true)

  await MyAccountHomePage.open()
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
})

When(
  /user pays the service charge using (a valid |)"([A-Za-z ]+)" "([A-Za-z ]+)" card "([0-9]+)"/,
  async function (isValid, cardBrand, cardType, cardNumber) {
    await MyAccountHomePage.navigateToPayServiceChargePage()
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
    await PayServiceChargePage.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      process.env.GOVPAY_SERVICE_FREE_PERIOD_END
    )
    await ReviewServiceChargePage.continueToMakePayment()

    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    this.uniquePaymentReference = uniquePaymentReference
    await GovPayPage.submitCardDetails(cardNumber)

    if (isValid.trim() === 'a valid') {
      await GovPayPage.verifyUserIsOnGovPayConfirmPage(uniquePaymentReference)
      await GovPayPage.confirmPayment()
    }
  }
)

Then(
  /^the payment should be "(successful|unsuccessful)"$/,
  async function (status) {
    const json = await GovPayPage.waitForPaymentStatus(
      this.apis.govPayAPI,
      this.uniquePaymentReference
    )
    this.paymentStatus = json

    if (status === 'unsuccessful') {
      expect(json.state.status).toMatch(/^(failed|error)$/)
    } else {
      const paymentReference =
        await ServiceChargePaymentDetailsPage.getPaymentReference()
      expect(json.state.status).toBe('success')
      expect(json.reference).toBe(paymentReference)
      expect(json.metadata.organisationId).toBe(this.organisationId)
      this.paymentId = json.payment_id
      this.paymentReference = json.reference
      this.paymentOrganisationId = json.metadata.organisationId
      this.paymentServicePeriodStart = json.metadata.servicePeriodStart
      this.paymentServicePeriodEnd = json.metadata.servicePeriodEnd
      // disableAfter flag on the organisation must reflect the future date
      const organisationDetails =
        await this.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
          this.organisationId,
          this.defraIdMockUserId
        )
      const endDate = new Date(process.env.GOVPAY_SERVICE_FREE_PERIOD_END)
      endDate.setFullYear(endDate.getFullYear() + 1)
      expect(organisationDetails.json.organisation.disableAfter).toBe(
        endDate.toISOString()
      )
      const month = endDate.toLocaleDateString('en-GB', { month: 'long' })
      const year = endDate.getFullYear()
      this.nextPaymentDueDate = `${month} ${year}`
    }
    expect(json.state.finished).toBe(true)
  }
)

Then(
  'the user should see an error message {string}',
  async function (expectedErrorMessage) {
    await GovPayPage.verifyUserIsOnGovPayErrorPage(expectedErrorMessage)
  }
)

Then(
  'the user should see the service charge notification banner',
  async function (dataTable) {
    const expectedMessages = dataTable.rowsHash()
    await MyAccountHomePage.verifyServiceChargeNotificationBanner(
      expectedMessages.heading,
      expectedMessages.body
    )
  }
)

When('user attempts to re-try the payment after the error', async function () {
  await GovPayPage.continueAfterPaymentError()
  await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargeFailedPaymentDetailsPage()
  await ServiceChargePaymentDetailsPage.retryPayment()
})

Then('the user is redirected to intiate payment page', async function () {
  await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
  await PayServiceChargePage.continueToPayServiceCharge()
  await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
    process.env.GOVPAY_SERVICE_FREE_PERIOD_END
  )
  await ReviewServiceChargePage.continueToMakePayment()
  const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
  expect(uniquePaymentReference).not.toBe(this.uniquePaymentReference)
})

When('the user re-attempts to pay service charge', async function () {
  await PayServiceChargePage.open()
  await MyAccountHomePage.isServiceChargeNotificationBannerDisplayed()
})

Then('refund summary status should be {string}', async function (status) {
  expect(this.paymentStatus).toBeDefined()
  this.refundSummary = this.paymentStatus.refund_summary
  expect(this.refundSummary?.status).toBe(status)
  expect(this.refundSummary.amount_available).toBeDefined()
  AllureReporter.addAttachment(
    'Refund summary',
    JSON.stringify(this.refundSummary, null, 2),
    'application/json'
  )
})

When('user requests for refund for the payment', async function () {
  const response = await this.apis.govPayAPI.issueARefund(
    this.uniquePaymentReference,
    this.refundSummary.amount_available
  )

  this.refundResponse = response
  this.refundId = response.json?.refund_id
})

Then(/^the refund should be "(successful)"$/, async function (status) {
  expect(status).toBe('successful')
  expect(this.refundResponse.statusCode).toBe(202)
  expect(this.refundId).toBeDefined()

  this.refundWebhookResponse =
    await this.apis.wasteOrganisationFrontendAPI.invokeWebhookForRefund(
      this.paymentReference,
      this.organisationId,
      this.paymentId,
      this.paymentServicePeriodStart,
      this.paymentServicePeriodEnd,
      this.env.GOVPAY_WEBHOOK_SIGNING_SECRET
    )

  expect([200, 204]).toContain(this.refundWebhookResponse.statusCode)
})

Then(
  /^organisation disableAfter (?:updates to|moves back to) payment\.(servicePeriodStart|servicePeriodEnd)$/,
  async function (servicePeriod) {
    const expectedDisableAfter =
      servicePeriod === 'servicePeriodStart'
        ? this.paymentServicePeriodStart
        : this.paymentServicePeriodEnd

    let organisationDetails

    await browser.waitUntil(
      async () => {
        organisationDetails =
          await this.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
            this.paymentOrganisationId,
            this.defraIdMockUserId
          )
        expect(organisationDetails.statusCode).toBe(200)
        this.disableAfter = organisationDetails.json.organisation.disableAfter

        return this.disableAfter === expectedDisableAfter
      },
      {
        timeout: 30000,
        interval: 3000,
        timeoutMsg: `Organisation disableAfter was not updated to ${expectedDisableAfter} within 30s`
      }
    )

    expect(this.disableAfter).toBeDefined()
    expect(expectedDisableAfter).toBeDefined()
    expect(this.disableAfter).toBe(expectedDisableAfter)
  }
)
