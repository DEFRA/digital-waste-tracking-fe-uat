import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'
import { browser } from '~/node_modules/@wdio/globals/build/index'

class ReviewServiceChargePage extends Page {
  // methods
  open() {
    return super.open('/service-charge')
  }

  // locators
  get heading() {
    return $('h1')
  }

  get continueButton() {
    return $('button[data-testid="review-payment-continue-button"]')
  }

  get cancelButton() {
    return $('a[data-testid="review-payment-cancel-link"]')
  }

  async verifyUserIsOnReviewServiceChargePage() {
    await this.verifyPageTitle(
      'Annual Report receipt of waste charge | Report receipt of waste'
    )
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Annual Report receipt of waste charge'
    )
    await expect(browser).toHaveUrl(/\/review-payment/)
  }

  async continueToMakePayment() {
    await this.continueButton.click()
  }

  async cancelReviewServiceCharge() {
    await this.cancelButton.click()
  }
}

export default new ReviewServiceChargePage()
