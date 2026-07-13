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
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage()
  }
)

When('user cancels the review service charge', async function () {
  await ReviewServiceChargePage.cancelReviewServiceCharge()
})

When('the service charge is due', async function () {
  // // // current date - 3 months
  // const threeMonthsAgo = new Date(Date.now() - 3 * 30 * 24 * 60 * 60 * 1000)
  // console.log(threeMonthsAgo.toISOString())
  // const response =
  //   await this.apis.wasteOrganisationBackendAPI.updateOrgnisationDetails(
  //     this.organisationId, {
  //       "organisation": {
  //         "disableAfter": '2026-06-01T00:00:00.000Z',
  //         "paymentPeriods": [
  //           {
  //             "from": "2026-06-01T00:00:00.000Z",
  //             "to": "2027-06-01T00:00:00.000Z",
  //             "priceInPence": 2600
  //           }
  //         ]
  //       }
  //     }
  //   )
  // expect(response.statusCode).toBe(200)
})

When('the service charge has already been paid', async function (dataTable) {
  const paymentDetails = dataTable.rowsHash()

  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()

  await PayServiceChargePage.open()
  await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
  await PayServiceChargePage.continueToPayServiceCharge()
  await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage()
  await ReviewServiceChargePage.continueToMakePayment()

  const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
  this.uniquePaymentReference = uniquePaymentReference
  await GovPayPage.submitCardDetails(paymentDetails.card_number)
  await GovPayPage.verifyUserIsOnGovPayConfirmPage(uniquePaymentReference)
  await GovPayPage.confirmPayment()

  const json = await GovPayPage.waitForPaymentStatus(
    this.apis.govPayAPI,
    uniquePaymentReference
  )
  expect(json.state.status).toBe('success')
  expect(json.state.finished).toBe(true)

  await ServiceChargePaymentDetailsPage.verifyUserIsOnServiceChargePaymentDetailsPage()
  await MyAccountHomePage.open()
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
})

When(
  /user pays the service charge using (a valid |)"([A-Za-z ]+)" "([A-Za-z ]+)" card "([0-9]+)"/,
  async function (isValid, cardBrand, cardType, cardNumber) {
    await MyAccountHomePage.navigateToPayServiceChargePage()
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
    await PayServiceChargePage.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage()
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

    if (status === 'unsuccessful') {
      expect(json.state.status).toMatch(/^(failed|error)$/)
    } else {
      const paymentReference =
        await ServiceChargePaymentDetailsPage.getPaymentReference()
      expect(json.state.status).toBe('success')
      expect(json.reference).toBe(paymentReference)
      expect(json.metadata.organisationId).toBe(this.organisationId)
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
  await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage()
  await ReviewServiceChargePage.continueToMakePayment()
  const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
  expect(uniquePaymentReference).not.toBe(this.uniquePaymentReference)
})

When('the user re-attempts to pay service charge', async function () {
  await PayServiceChargePage.open()
  await MyAccountHomePage.isServiceChargeNotificationBannerDisplayed()
})
