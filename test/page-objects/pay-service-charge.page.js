import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'
import { browser } from '~/node_modules/@wdio/globals/build/index'
import ReviewServiceChargePage from './review-service-charge.page.js'
import { config } from '../../wdio.conf.js'

class PayServiceChargePage extends Page {
  // methods
  open() {
    return super.open('/service-charge')
  }

  async openInNewTab() {
    await browser.newWindow(`${config.baseUrl}/service-charge`, {
      type: 'tab'
    })
  }

  // locators
  get heading() {
    return $('h1')
  }

  get payServiceChargeButton() {
    return $('a[data-testid="pay-service-charge-button"]')
  }

  get cancelButton() {
    return $('a[data-testid="service-charge-cancel-link"]')
  }

  async verifyUserIsOnPayServiceChargePage() {
    await this.verifyPageTitle(
      'Pay the annual report receipt of waste service charge | Report receipt of waste'
    )
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Pay the annual report receipt of waste service charge'
    )
    await expect(browser).toHaveUrl(/\/service-charge/)
  }

  async continueToPayServiceCharge() {
    await this.payServiceChargeButton.click()
  }

  async cancelPayServiceCharge() {
    await this.cancelButton.click()
  }

  async continueToGovPay(freePeriodEndDate) {
    await this.verifyUserIsOnPayServiceChargePage()
    await this.continueToPayServiceCharge()
    await ReviewServiceChargePage.verifyUserIsOnReviewServiceChargePage(
      freePeriodEndDate
    )
    await ReviewServiceChargePage.continueToMakePayment()
  }
}

export default new PayServiceChargePage()
