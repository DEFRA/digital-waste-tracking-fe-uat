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

When(
  'user pays the service charge using below card details:',
  async function (table) {
    const cardNumber = table.raw()[1][0]
    await GovPayPage.enterCardDetails(cardNumber)
    // Write code here that turns the phrase above into concrete actions
  }
)

When('the service charge is due', async function () {})

When(
  'user pays the service charge using {string} {string} card {string}',
  async function (cardBrand, cardType, cardNumber) {
    await MyAccountHomePage.navigateToPayServiceChargePage()
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
    await PayServiceChargePage.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage()
    await ReviewServiceChargePage.continueToMakePayment()

    const uniquePaymentReference = await GovPayPage.verifyUserIsOnGovPayPage()
    this.uniquePaymentReference = uniquePaymentReference
    await GovPayPage.submitCardDetails(cardNumber)
    await GovPayPage.verifyUserIsOnGovPayConfirmPage(uniquePaymentReference)
    await GovPayPage.confirmPayment()
  }
)

Then('the payment should be successful', async function () {
  // TODO: Verify the payment is successful, waiting for implementation to complete
  // await GovPayPage.verifyUserIsOnGovPaySuccessPage()

  const json = await GovPayPage.waitForPaymentStatus(
    this.apis.govPayAPI,
    this.uniquePaymentReference
  )
  expect(json.state.status).toBe('success')
  expect(json.state.finished).toBe(true)
})
