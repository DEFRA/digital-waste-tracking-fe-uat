import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { browser, $ } from '@wdio/globals'

class IsWasteReceiverPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get yesButton() {
    return $('#isWasteReceiverYes')
  }

  get noButton() {
    return $('#isWasteReceiver-2')
  }

  // assertions
  async verifyUserIsOnIsWasteReceiverPage() {
    await expect(browser).toHaveUrl(config.baseUrl + '/is-waste-receiver')
    await expect(this.heading).toBeDisplayed()
    // ToDo : improve this after the sync process is implemented
    // await expect(this.heading).toHaveText('Is your organisation a waste receiver?')
  }
}

export default new IsWasteReceiverPage()
