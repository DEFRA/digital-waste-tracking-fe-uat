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
    return $('a[data-testid="review-payment-continue-button"]')
  }

  get cancelButton() {
    return $('a[data-testid="review-payment-cancel-link"]')
  }

  get validUntilDate() {
    return $('p[data-testid="review-payment-intro"]>strong')
  }

  async verifyUserIsOnReviewServiceChargePage(freePeriodEndDate) {
    const endDate = new Date(freePeriodEndDate)
    endDate.setFullYear(endDate.getFullYear() + 1)
    const formattedDate = formatGovPayDate(endDate)
    await this.verifyPageTitle(
      'Annual Report receipt of waste charge | Report receipt of waste'
    )
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Annual Report receipt of waste charge'
    )
    await expect(browser).toHaveUrl(/\/review-payment/)
    await expect(this.validUntilDate).toHaveText(formattedDate)
  }

  async continueToMakePayment() {
    await this.continueButton.click()
  }

  async cancelReviewServiceCharge() {
    await this.cancelButton.click()
  }
}

/**
 * Formats a Date as e.g. "1:00am on Thursday 30 September 2027."
 * @param {Date} date
 * @returns {string}
 */
function formatGovPayDate(date) {
  const weekday = date.toLocaleDateString('en-GB', { weekday: 'long' })
  const day = date.getDate()
  const month = date.toLocaleDateString('en-GB', { month: 'long' })
  const year = date.getFullYear()

  const hours = date.getHours() % 12 || 12
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const ampm = date.getHours() < 12 ? 'am' : 'pm'

  return `${hours}:${minutes}${ampm} on ${weekday} ${day} ${month} ${year}`
}

export default new ReviewServiceChargePage()
