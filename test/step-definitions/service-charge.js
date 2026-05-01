import PayServiceChargePage from '../page-objects/pay-service-charge.page.js'
import ReviewServiceChargePage from '../page-objects/review-service-charge.page.js'
import { When } from '@wdio/cucumber-framework'

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
