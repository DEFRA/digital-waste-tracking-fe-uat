import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $ } from '@wdio/globals'

// as DefraId is a 3rd party service, trying to capture all pages in a single page object

class DefraId extends Page {
  // locators
  get replacementForm() {
    return $('#replacementSelectIdentityProvider')
  }

  get heading() {
    return $('#replacementSelectIdentityProvider h1#header')
  }

  // Choose Sign In Page locators

  get govUKOneLoginRadio() {
    return $('#replacementSelectIdentityProvider #one')
  }

  get govGatewayRadio() {
    return $('#replacementSelectIdentityProvider #scp')
  }

  get continueButton() {
    return $('#replacementSelectIdentityProvider #continueReplacement')
  }

  // Helper methods
  async selectSignInMethod(radioElement, methodName) {
    // Wait for the replacement form to be visible
    await this.replacementForm.waitForDisplayed({
      timeout: config.waitforTimeout
    })

    // Wait for the specific radio button to be displayed and clickable
    await radioElement.waitForDisplayed({ timeout: config.waitforTimeout })

    await radioElement.waitForClickable({ timeout: config.waitforTimeout })

    // Click the radio button
    await radioElement.click()

    // Verify it's selected
    const isSelected = await radioElement.isSelected()

    if (!isSelected) {
      throw new Error(`Failed to select ${methodName} radio button`)
    }
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

    // Get and log the heading text for debugging
    // const headingText = await this.getTextFrom(this.heading)

    // Verify the heading text
    await expect(this.heading).toHaveText('How do you want to sign in?')
  }
  // Choose Sign In Page

  // Sign in using Government Gateway Page locators
  get govGatewayUserIdInput() {
    return $('#user-id')
  }

  get govGatewayPasswordInput() {
    return $('#password')
  }

  get govGatewayContinueButton() {
    return $('#continue')
  }

  async verifyUserIsOnLoginUsingGovernmentGatewayPage() {
    // Wait for heading to be displayed
    await expect(this.heading).toBeDisplayed()

    // Get and log the heading text for debugging
    // const headingText = await this.getTextFrom(this.heading)

    // Verify the heading text
    await expect(this.heading).toHaveText('Sign in using Government Gateway')
  }
}

export default new DefraId()
