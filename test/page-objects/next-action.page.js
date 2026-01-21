import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { browser, $ } from '@wdio/globals'

class NextActionPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  // assertions
  async verifyUserIsOnChooseNextActionPage() {
    await expect(browser).toHaveUrl(config.baseUrl + '/next-action')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('What do you want to do?')
  }
}

export default new NextActionPage()
