import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'

class HomePage extends Page {
  // locators
  get heading() {
    return $(
      '.gem-c-organisation-logo.brand--department-for-environment-food-rural-affairs'
    )
  }

  // methods
  open() {
    return super.open(
      '/government/organisations/department-for-environment-food-rural-affairs'
    )
  }

  // assertions
  async verifyUserIsOnHomePage() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Department\nfor Environment,\nFood & Rural Affairs'
    )
  }

  async verifySuperNavigationSectionIsDisplayed() {
    await expect(this.superNavigationSection).toBeDisplayed()
  }

  async verifyUserNavigatedCorrectlyToTargetPage(targetUrl) {
    await expect(await this.getUrl()).toBe(config.baseUrl + targetUrl)
  }
}

export default new HomePage()
