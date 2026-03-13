import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'
import { browser } from '~/node_modules/@wdio/globals/build/index'
import { config } from '../../wdio.conf.js'

class MyAccountHomePage extends Page {
  // methods
  open() {
    return super.open('/account')
  }

  // locators
  get heading() {
    return $('h1')
  }

  get ReportReceiptOfWasteButton() {
    return $('a[data-testid="report-waste-link"]')
  }

  async verifyUserIsOnMyAccountHomePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Waste receiving account')
    await expect(browser).toHaveUrl(config.baseUrl + '/account')
  }

  async navigateToReportReceiptOfWasteOptionsPage() {
    await this.ReportReceiptOfWasteButton.click()
  }
}

export default new MyAccountHomePage()
