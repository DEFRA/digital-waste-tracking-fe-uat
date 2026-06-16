import PayServiceChargePage from '../page-objects/pay-service-charge.page.js'
import ReviewServiceChargePage from '../page-objects/review-service-charge.page.js'
import { When, Then } from '@wdio/cucumber-framework'
import GovPayPage from '../page-objects/gov-pay.page.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'

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

When('the service charge is due', async function () {})

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
      expect(json.state.status).toBe('success')
      // TODO: Verify the payment is successful, waiting for implementation to complete
      // await GovPayPage.verifyUserIsOnGovPaySuccessPage()
    }
    expect(json.state.finished).toBe(true)
  }
)
