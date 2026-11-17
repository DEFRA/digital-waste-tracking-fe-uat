import { Page } from 'page-objects/page'
import { $ } from '@wdio/globals'

class DefraIdChooseSignInPage extends Page {
  // Choose Sign In Page locators

  get replacementForm() {
    return $('#replacementSelectIdentityProvider')
  }

  get heading() {
    return $('#replacementSelectIdentityProvider h1#header')
  }

  get govUKOneLoginRadio() {
    return $('#replacementSelectIdentityProvider #one')
  }

  get govGatewayRadio() {
    return $('#replacementSelectIdentityProvider #scp')
  }

  get continueButton() {
    return $('#replacementSelectIdentityProvider #continueReplacement')
  }

  async selectSignInMethod(methodName) {
    let radioElement
    let radioId

    await this.replacementForm.waitForExist()

    if (methodName === 'Government Gateway') {
      radioElement = this.govGatewayRadio
      radioId = 'scp'
    } else {
      radioElement = this.govUKOneLoginRadio
      radioId = 'one'
    }

    // Wait for radio button to exist
    await radioElement.waitForExist()

    // Use base class method to select radio button using JavaScript
    await this.selectRadioUsingJavaScript(radioId, `${methodName} radio button`)

    // Small wait for any event handlers
    // eslint-disable-next-line wdio/no-pause -- Required to allow navigation to start
    await browser.pause(500)
  }

  async clickContinueButton() {
    await this.continueButton.waitForExist()

    // Use base class method to click using JavaScript
    await this.continueButton.scrollIntoView()
    await this.continueButton.click()
  }

  // assertions
  async verifyUserIsOnDefraIdChooseSignInPage() {
    // IMPORTANT: Wait for the replacement form to be visible first
    // The page loads a default Azure B2C form, then JavaScript swaps it with the GOV.UK styled form
    await this.replacementForm.waitForDisplayed()

    // Wait for heading to be displayed
    await this.verifyPageHeading()
  }

  // Choose Sign In Page -- end
}

export default new DefraIdChooseSignInPage()
