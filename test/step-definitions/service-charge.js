import PayServiceChargePage from '../page-objects/pay-service-charge.page.js'
import ReviewServiceChargePage from '../page-objects/review-service-charge.page.js'
import { When, Then } from '@wdio/cucumber-framework'
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

When(
  'a service charge payment is already in progress for the organisation',
  async function () {
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    await PayServiceChargePage.open()
    await PayServiceChargePage.continueToGovPay(
      process.env.GOVPAY_SERVICE_FREE_PERIOD_END
    )

    this.uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    expect(this.uniquePaymentReference).toBeDefined()
  }
)

When(
  'the user re-attempts to pay service charge through GOV.UK Pay',
  async function () {
    await PayServiceChargePage.open()
    await PayServiceChargePage.continueToGovPay(
      process.env.GOVPAY_SERVICE_FREE_PERIOD_END
    )
  }
)

When(
  'user opens a new tab and navigates to pay service charge',
  async function () {
    await PayServiceChargePage.openInNewTab()
    await PayServiceChargePage.continueToGovPay(
      process.env.GOVPAY_SERVICE_FREE_PERIOD_END
    )
  }
)

Then(
  'same payment session should be resumed and user should be redirected to GOV.UK Pay',
  async function () {
    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    expect(uniquePaymentReference).toBe(this.uniquePaymentReference)
  }
)

When('the service charge is due', async function () {})

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

  await GovPayPage.waitForPaymentStatus(
    this.apis.govPayAPI,
    uniquePaymentReference
  )

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
      this.refundSummary = json.refund_summary
      expect(this.refundSummary?.status).toBe('available')
      expect(this.refundSummary.amount_available).toBeDefined()
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
    await GovPayPage.continueAfterPaymentError()
    await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargeFailedPaymentDetailsPage()
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
  // await GovPayPage.continueAfterPaymentError()
  // await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargeFailedPaymentDetailsPage()
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

Then(
  /^refund summary status should be "([^"]+)" with remaining amount available$/,
  async function (status) {
    expect(this.expectedRefundAmountAvailable).toBeDefined()

    const { refundSummary } = await GovPayPage.verifyRefundSummaryStatus(
      this.apis.govPayAPI,
      this.uniquePaymentReference,
      status,
      this.expectedRefundAmountAvailable
    )
    this.refundSummary = refundSummary
  }
)

When(
  /^the user requests a (full|partial) refund(?: of ([0-9]+))? for the payment$/,
  async function (refundType, refundAmount) {
    const { expectedRefundAmountAvailable, refundResponse, refundId } =
      await GovPayPage.issueRefund(
        this.apis.govPayAPI,
        this.uniquePaymentReference,
        this.refundSummary,
        refundType,
        refundAmount
      )

    this.expectedRefundAmountAvailable = expectedRefundAmountAvailable
    this.refundResponse = refundResponse
    this.refundId = refundId

    this.refundWebhookResponse =
      await this.apis.wasteOrganisationFrontendAPI.invokeWebhookForRefund(
        this.paymentReference,
        this.organisationId,
        this.paymentId,
        this.paymentServicePeriodStart,
        this.paymentServicePeriodEnd,
        this.env.GOVPAY_WEBHOOK_SIGNING_SECRET
      )
  }
)

Then(/^the refund should be "(successful)"$/, async function (status) {
  expect(status).toBe('successful')
  expect(this.refundResponse.statusCode).toBe(202)
  expect(this.refundId).toBeDefined()
  expect([200, 204]).toContain(this.refundWebhookResponse.statusCode)

  this.disableAfter =
    await ServiceChargePaymentDetailsPage.verifyOrganisationDisableAfter(
      this.apis.wasteOrganisationBackendAPI,
      this.paymentOrganisationId,
      this.defraIdMockUserId,
      this.paymentServicePeriodStart
    )
})
