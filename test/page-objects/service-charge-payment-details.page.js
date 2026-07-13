import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'
import { browser } from '~/node_modules/@wdio/globals/build/index'

class ServiceChargePaymentDetailsPage extends Page {
  // methods
  open() {
    return super.open('/payment-details')
  }

  // locators
  get heading() {
    return $('h1')
  }

  get paymentReference() {
    return $('strong[data-testid="payment-reference"]')
  }

  get continueButton() {
    return $('a[data-testid="review-payment-continue-button"]')
  }

  get cancelButton() {
    return $('a[data-testid="review-payment-cancel-link"]')
  }

  get retryPaymentLink() {
    return $('a[data-testid="payment-return-link"]')
  }

  async verifyUserIsOnServiceChargePaymentDetailsPage() {
    await this.verifyPageTitle('Payment confirmation | Report receipt of waste')
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Payment confirmation')
    await expect(browser).toHaveUrl(/\/payment-details/)
  }

  async getPaymentReference() {
    return this.paymentReference.getText()
  }

  async verifyUserIsOnServiceChargeFailedPaymentDetailsPage() {
    await this.verifyPageTitle(
      'Your payment has been declined | Report receipt of waste'
    )
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Your payment has been declined')
    await expect(browser).toHaveUrl(/\/payment-details/)
  }

  async retryPayment() {
    await this.retryPaymentLink.waitForDisplayed()
    await this.click(this.retryPaymentLink)
  }
}

export default new ServiceChargePaymentDetailsPage()
