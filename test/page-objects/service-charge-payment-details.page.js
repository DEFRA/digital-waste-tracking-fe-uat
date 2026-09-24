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

  get paymentErrorBody() {
    return $('p[data-testid="payment-pending-summaryContent"]')
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
    await this.verifyPageTitle()
    await this.elementIsDisplayed(this.heading)
    await this.verifyPageHeading()
    await expect(browser).toHaveUrl(/\/payment-details/)
  }

  async getPaymentReference() {
    return this.paymentReference.getText()
  }

  async verifyUserIsOnServiceChargeFailedPaymentDetailsPage() {
    await this.verifyPageTitle('serviceChargePaymentUnsuccessful')
    await this.elementIsDisplayed(this.heading)
    await this.verifyPageHeading('serviceChargePaymentUnsuccessful')
    await expect(browser).toHaveUrl(/\/payment-details/)
    await expect(this.paymentErrorBody).toBeDisplayed()
    await expect(this.paymentErrorBody).toHaveText(
      'Contact your bank for more details or try again.'
    )
  }

  async retryPayment() {
    await this.retryPaymentLink.waitForDisplayed()
    await this.click(this.retryPaymentLink)
  }

  async verifyOrganisationDisableAfter(
    wasteOrganisationBackendAPI,
    organisationId,
    userId,
    expectedDisableAfter
  ) {
    let disableAfter

    await browser.waitUntil(
      async () => {
        const organisationDetails =
          await wasteOrganisationBackendAPI.getOrganisationDetails(
            organisationId,
            userId
          )
        expect(organisationDetails.statusCode).toBe(200)
        disableAfter = organisationDetails.json.organisation.disableAfter

        return disableAfter === expectedDisableAfter
      },
      {
        timeout: 30000,
        interval: 3000,
        timeoutMsg: `Organisation disableAfter was not updated to ${expectedDisableAfter} within 30s`
      }
    )

    expect(disableAfter).toBeDefined()
    expect(expectedDisableAfter).toBeDefined()
    expect(disableAfter).toBe(expectedDisableAfter)

    return disableAfter
  }
}

export default new ServiceChargePaymentDetailsPage()
