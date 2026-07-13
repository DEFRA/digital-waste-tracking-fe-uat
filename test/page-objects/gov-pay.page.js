import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import logger from '@wdio/logger'

// as gov pay is a 3rd party service, trying to use same page object for all pages
const log = logger('gov-pay-page')
class GovPayPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get cardDetailsForm() {
    return $('#card-details')
  }

  get continueButton() {
    return $('#submit-card-details')
  }

  get cardNumberInput() {
    return $('#card-no')
  }

  get expiryMonthInput() {
    return $('#expiry-month')
  }

  get expiryYearInput() {
    return $('#expiry-year')
  }

  get nameOnCardInput() {
    return $('#cardholder-name')
  }

  get cvvInput() {
    return $('#cvc')
  }

  get addressLine1Input() {
    return $('#address-line-1')
  }

  get addressLine2Input() {
    return $('#address-line-2')
  }

  get cityInput() {
    return $('#address-city')
  }

  get postcodeInput() {
    return $('#address-postcode')
  }

  get countryInput() {
    return $('#address-country')
  }

  get emailInput() {
    return $('#email')
  }

  // confirm payment page
  get confirmPaymentButton() {
    return $('#confirm')
  }

  // start again button
  get startAgainButton() {
    return $('#return-url')
  }

  async verifyUserIsOnGovPayPage() {
    await expect(browser).toHaveUrl(/\/card_details\/.*/)
    await this.verifyPageTitle('Enter payment details')
    const url = await browser.getUrl()
    const regexpSize = /card_details\/(.*)/
    const match = url.match(regexpSize)
    return match[1]
  }

  async verifyUserIsOnGovPayConfirmPage(uniquePaymentReference) {
    await expect(browser).toHaveUrl(/\/card_details\/[a-zA-Z0-9-]+\/confirm/)
    const url = await browser.getUrl()
    await expect(url).toContain(
      `/card_details/${uniquePaymentReference}/confirm`
    )

    await this.verifyPageTitle('Confirm your payment')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Confirm your payment')
  }

  async verifyUserIsOnGovPayErrorPage(expectedErrorMessage) {
    await expect(browser).toHaveUrl(/\/card_details\/.*/)
    await this.verifyPageTitle(expectedErrorMessage)
    const url = await browser.getUrl()
    const regexpSize = /card_details\/(.*)/
    const match = url.match(regexpSize)
    return match[1]
  }

  async submitCardDetails(cardNumber) {
    const expiryDate = new Date()
    const expiryMonth = expiryDate.getMonth() + 1
    const expiryYear = expiryDate.getFullYear()
    const nameOnCard = 'John Doe'
    const cvv = '123'
    const addressLine1 = '123 Main St'
    const addressLine2 = 'Apt 1'
    const city = 'Anytown'
    const postcode = 'EC1M 5NZ'
    const country = 'United Kingdom'
    // const email = 'autotest.ee@gmail.com'

    const email = 'simulate-delivered@notifications.service.gov.uk'

    await this.cardDetailsForm.waitForDisplayed()

    await this.enterText(this.cardNumberInput, cardNumber)
    await this.enterText(this.expiryMonthInput, expiryMonth)
    await this.enterText(this.expiryYearInput, expiryYear)
    await this.enterText(this.nameOnCardInput, nameOnCard)
    await this.enterText(this.cvvInput, cvv)
    await this.enterText(this.addressLine1Input, addressLine1)
    await this.enterText(this.addressLine2Input, addressLine2)
    await this.enterText(this.cityInput, city)
    await this.enterText(this.postcodeInput, postcode)
    await this.enterText(this.countryInput, country)
    await this.enterText(this.emailInput, email)
    await this.click(this.continueButton)
  }

  async confirmPayment() {
    await this.confirmPaymentButton.waitForDisplayed()
    await this.click(this.confirmPaymentButton)
  }

  async waitForPaymentStatus(govPayAPI, paymentReference, timeoutMs = 30000) {
    let json = null
    try {
      await browser.waitUntil(
        async () => {
          const response = await govPayAPI.getPaymentStatus(paymentReference)
          json = response.json
          return response.statusCode !== 404
        },
        {
          timeout: timeoutMs,
          interval: 3000,
          timeoutMsg: `Payment status for payment reference "${paymentReference}" was not found within ${timeoutMs / 1000}s`
        }
      )
    } catch (error) {
      log.error(
        `waitForPaymentStatus timed out or errored for reference "${paymentReference}":`,
        error.message
      )
    }
    return json
  }

  async continueAfterPaymentError() {
    await this.startAgainButton.waitForDisplayed()
    await this.click(this.startAgainButton)
  }
}

export default new GovPayPage()
