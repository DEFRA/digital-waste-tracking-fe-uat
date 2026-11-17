import PayServiceChargePage from '../page-objects/pay-service-charge.page.js'
import ReviewServiceChargePage from '../page-objects/review-service-charge.page.js'
import { When, Then } from '@wdio/cucumber-framework'
import GovPayPage from '../page-objects/gov-pay.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import ServiceChargePaymentDetailsPage from '../page-objects/service-charge-payment-details.page.js'

When(
  'the user continues to pay the service charge',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await PayServiceChargePage.continueToPayServiceCharge()
  }
)

When(
  'user cancels the pay service charge',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await PayServiceChargePage.cancelPayServiceCharge()
  }
)

When(
  'the user allowed to review the service charge details',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      this.testEnv.govPayServiceFreePeriodEnd
    )
  }
)

When(
  'user cancels the review service charge',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ReviewServiceChargePage.cancelReviewServiceCharge()
  }
)

When(
  'a service charge payment is already in progress for the organisation',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    await PayServiceChargePage.open()
    await PayServiceChargePage.continueToGovPay(
      this.testEnv.govPayServiceFreePeriodEnd
    )

    this.testMemory.uniquePaymentReference =
      await GovPayPage.verifyUserIsOnGovPayPage()
    expect(this.testMemory.uniquePaymentReference).toBeDefined()
  }
)

When(
  'the user re-attempts to pay service charge through GOV.UK Pay',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await PayServiceChargePage.open()
    await PayServiceChargePage.continueToGovPay(
      this.testEnv.govPayServiceFreePeriodEnd
    )
  }
)

When(
  'user opens a new tab and navigates to pay service charge',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await PayServiceChargePage.openInNewTab()
    await PayServiceChargePage.continueToGovPay(
      this.testEnv.govPayServiceFreePeriodEnd
    )
  }
)

Then(
  'same payment session should be resumed and user should be redirected to GOV.UK Pay',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    expect(uniquePaymentReference).toBe(this.testMemory.uniquePaymentReference)
  }
)

When(
  'the service charge is due',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {}
)

When(
  'the service charge has already been paid',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    dataTable
  ) {
    const paymentDetails = dataTable.rowsHash()

    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()

    await PayServiceChargePage.open()
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
    await PayServiceChargePage.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      this.testEnv.govPayServiceFreePeriodEnd
    )
    await ReviewServiceChargePage.continueToMakePayment()

    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    this.testMemory.uniquePaymentReference = uniquePaymentReference
    await GovPayPage.submitCardDetails(paymentDetails.card_number)
    await GovPayPage.verifyUserIsOnGovPayConfirmPage(uniquePaymentReference)
    await GovPayPage.confirmPayment()

    await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargePaymentDetailsPage()

    await GovPayPage.waitForPaymentStatus(
      this.testMemory.apis.govPayAPI,
      uniquePaymentReference
    )

    await MyAccountHomePage.open()
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  }
)

When(
  /user pays the service charge using (a valid |)"([A-Za-z ]+)" "([A-Za-z ]+)" card "([0-9]+)"/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    isValid,
    cardBrand,
    cardType,
    cardNumber
  ) {
    await MyAccountHomePage.navigateToPayServiceChargePage()
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
    await PayServiceChargePage.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      this.testEnv.govPayServiceFreePeriodEnd
    )
    await ReviewServiceChargePage.continueToMakePayment()

    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    this.testMemory.uniquePaymentReference = uniquePaymentReference
    await GovPayPage.submitCardDetails(cardNumber)

    if (isValid.trim() === 'a valid') {
      await GovPayPage.verifyUserIsOnGovPayConfirmPage(uniquePaymentReference)
      await GovPayPage.confirmPayment()
    }
  }
)

Then(
  /^the payment should be "(successful|unsuccessful)"$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    status
  ) {
    const json = await GovPayPage.waitForPaymentStatus(
      this.testMemory.apis.govPayAPI,
      this.testMemory.uniquePaymentReference
    )
    this.testMemory.paymentStatus = json

    if (status === 'unsuccessful') {
      expect(json.state.status).toMatch(/^(failed|error)$/)
    } else {
      const paymentReference =
        await ServiceChargePaymentDetailsPage.getPaymentReference()
      expect(json.state.status).toBe('success')
      expect(json.reference).toBe(paymentReference)
      expect(json.metadata.organisationId).toBe(this.testMemory.organisationId)
      this.testMemory.paymentId = json.payment_id
      this.testMemory.paymentReference = json.reference
      this.testMemory.paymentOrganisationId = json.metadata.organisationId
      this.testMemory.paymentServicePeriodStart =
        json.metadata.servicePeriodStart
      this.testMemory.paymentServicePeriodEnd = json.metadata.servicePeriodEnd
      this.testMemory.refundSummary = json.refund_summary
      expect(this.testMemory.refundSummary?.status).toBe('available')
      expect(this.testMemory.refundSummary.amount_available).toBeDefined()
      // disableAfter flag on the organisation must reflect the future date
      const organisationDetails =
        await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
          this.testMemory.organisationId,
          this.testMemory.defraIdMockUserId
        )
      const endDate = new Date(this.testEnv.govPayServiceFreePeriodEnd)
      endDate.setFullYear(endDate.getFullYear() + 1)
      expect(organisationDetails.json.organisation.disableAfter).toBe(
        endDate.toISOString()
      )
      const locale =
        ServiceChargePaymentDetailsPage.usersLanguagePreference === 'cy'
          ? 'cy-GB'
          : 'en-GB'
      const month = endDate.toLocaleDateString(locale, { month: 'long' })
      const year = endDate.getFullYear()
      this.testMemory.nextPaymentDueDate = `${month} ${year}`
    }
    expect(json.state.finished).toBe(true)
  }
)

Then(
  'the user should see an error message {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    expectedErrorMessage
  ) {
    await GovPayPage.verifyUserIsOnGovPayErrorPage(expectedErrorMessage)
    await GovPayPage.continueAfterPaymentError()
    await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargeFailedPaymentDetailsPage()
  }
)

Then(
  'the user should see the service charge notification banner',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    dataTable
  ) {
    const expectedMessages = dataTable.rowsHash()
    await MyAccountHomePage.verifyServiceChargeNotificationBanner(
      expectedMessages.heading,
      expectedMessages.body
    )
  }
)

When(
  'user attempts to re-try the payment after the error',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    // await GovPayPage.continueAfterPaymentError()
    // await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargeFailedPaymentDetailsPage()
    await ServiceChargePaymentDetailsPage.retryPayment()
  }
)

Then(
  'the user is redirected to intiate payment page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
    await PayServiceChargePage.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      this.testEnv.govPayServiceFreePeriodEnd
    )
    await ReviewServiceChargePage.continueToMakePayment()
    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    expect(uniquePaymentReference).not.toBe(
      this.testMemory.uniquePaymentReference
    )
  }
)

When(
  'the user re-attempts to pay service charge',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await PayServiceChargePage.open()
    await MyAccountHomePage.isServiceChargeNotificationBannerDisplayed()
  }
)

Then(
  /^refund summary status should be "([^"]+)" with remaining amount available$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    status
  ) {
    expect(this.testMemory.expectedRefundAmountAvailable).toBeDefined()

    const { refundSummary } = await GovPayPage.verifyRefundSummaryStatus(
      this.testMemory.apis.govPayAPI,
      this.testMemory.uniquePaymentReference,
      status,
      this.testMemory.expectedRefundAmountAvailable
    )
    this.testMemory.refundSummary = refundSummary
  }
)

When(
  /^the user requests a (full|partial) refund(?: of ([0-9]+))? for the payment$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    refundType,
    refundAmount
  ) {
    const { expectedRefundAmountAvailable, refundResponse, refundId } =
      await GovPayPage.issueRefund(
        this.testMemory.apis.govPayAPI,
        this.testMemory.uniquePaymentReference,
        this.testMemory.refundSummary,
        refundType,
        refundAmount
      )

    this.testMemory.expectedRefundAmountAvailable =
      expectedRefundAmountAvailable
    this.testMemory.refundResponse = refundResponse
    this.testMemory.refundId = refundId

    this.testMemory.refundWebhookResponse =
      await this.testMemory.apis.wasteOrganisationFrontendAPI.invokeWebhookForRefund(
        this.testMemory.paymentReference,
        this.testMemory.organisationId,
        this.testMemory.paymentId,
        this.testMemory.paymentServicePeriodStart,
        this.testMemory.paymentServicePeriodEnd,
        this.testEnv.govPayWebhookSigningSecret
      )
  }
)

Then(
  /^the refund should be "(successful)"$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    status
  ) {
    expect(status).toBe('successful')
    expect(this.testMemory.refundResponse.statusCode).toBe(202)
    expect(this.testMemory.refundId).toBeDefined()
    expect([200, 204]).toContain(
      this.testMemory.refundWebhookResponse.statusCode
    )

    this.testMemory.disableAfter =
      await ServiceChargePaymentDetailsPage.verifyOrganisationDisableAfter(
        this.testMemory.apis.wasteOrganisationBackendAPI,
        this.testMemory.paymentOrganisationId,
        this.testMemory.defraIdMockUserId,
        this.testMemory.paymentServicePeriodStart
      )
  }
)
