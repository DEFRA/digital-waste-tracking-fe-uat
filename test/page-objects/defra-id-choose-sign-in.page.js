import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $ } from '@wdio/globals'

// as DefraId is a 3rd party service, trying to capture all pages in a single page object

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

  async selectSignInMethod(radioElement, methodName) {
    await this.replacementForm.waitForExist({
      timeout: config.waitforTimeout
    })
    // console.log('✓ Replacement form exists in DOM')

    // Wait for radio button to exist
    // console.log(`Waiting for ${methodName} radio button to exist...`)
    await radioElement.waitForExist({ timeout: config.waitforTimeout })
    // console.log(`✓ ${methodName} radio button exists`)

    // Get the radio button ID for direct DOM manipulation
    const radioId = methodName === 'Government Gateway' ? 'scp' : 'one'

    // Use base class method to select radio button using JavaScript
    await this.selectRadioUsingJavaScript(radioId, `${methodName} radio button`)

    // Small wait for any event handlers
    // eslint-disable-next-line wdio/no-pause -- Required to allow navigation to start
    await browser.pause(500)

    // if (!isSelected) {
    //   // console.warn(
    //   //   `Warning: ${methodName} radio not showing as selected, but click was executed`
    //   // )
    // } else {
    //   // console.log(`✓ Successfully selected ${methodName}\n`)
    // }
  }

  async clickContinueButton() {
    await this.continueButton.waitForExist({ timeout: config.waitforTimeout })
    // console.log('✓ Continue button exists in DOM')

    // Use base class method to click using JavaScript
    await this.clickUsingJavaScript('continueReplacement', 'Continue button')

    // Small wait for navigation to start
    // eslint-disable-next-line wdio/no-pause -- Required to allow navigation to start after button click
    await browser.pause(500)
  }

  // assertions
  async verifyUserIsOnDefraIdChooseSignInPage() {
    // IMPORTANT: Wait for the replacement form to be visible first
    // The page loads a default Azure B2C form, then JavaScript swaps it with the GOV.UK styled form
    await this.replacementForm.waitForDisplayed({
      timeout: config.waitforTimeout
    })

    // Wait for heading to be displayed
    await expect(this.heading).toBeDisplayed()

    // Verify the heading text
    await expect(this.heading).toHaveText('How do you want to sign in?')
  }

  // Choose Sign In Page -- end
}

export default new DefraIdChooseSignInPage()
