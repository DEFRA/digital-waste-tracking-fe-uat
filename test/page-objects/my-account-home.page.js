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

  get organisationName() {
    return $('p[data-testid="app-heading-organisation-name"]')
  }

  get reportReceiptOfWasteButton() {
    return $('a[data-testid="report-waste-link"]')
  }

  get switchOrganisationButton() {
    return $('a[data-testid="switch-organisation-button"]')
  }

  get manageAccountButton() {
    return $('a[data-testid="manage-account-link"]')
  }

  get accountCards() {
    return $$('div[data-testid="account-cards"]>div')
  }

  async isUserOnMyAccountHomePage() {
    const currentUrl = await browser.getUrl()
    return currentUrl.includes(config.baseUrl + '/account')
  }

  async verifyUserIsOnMyAccountHomePage(organisationName = undefined) {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Waste receiving account')
    await expect(browser).toHaveUrl(config.baseUrl + '/account')

    if (organisationName) {
      await expect(this.organisationName).toBeDisplayed()
      await expect(this.organisationName).toHaveText(organisationName)
    }
    await expect(this.switchOrganisationButton).toBeDisplayed()

    const cards = await this.accountCards.getElements()
    const cardsText = await cards.map(async (card) => {
      return await card.getText()
    })
    expect(cardsText).toContain('Report receipt of waste')
    expect(cardsText).toContain('Manage account')
    expect(cardsText).toEqual(
      expect.arrayContaining([expect.stringContaining('Service charge')])
    )
  }

  async navigateToReportReceiptOfWasteOptionsPage() {
    await this.reportReceiptOfWasteButton.click()
  }

  async switchToDifferentBusiness() {
    await this.switchOrganisationButton.click()
  }

  async navigateToManageAccountPage() {
    await this.manageAccountButton.click()
  }

  async verifyUserIsOnDefraManageAccountPage() {
    // Note : this is not our page, it is the defra id service page
    await expect(browser).toHaveUrl(/\/management\/account-management\/me/i)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Your Defra account')
  }
}

export default new MyAccountHomePage()
