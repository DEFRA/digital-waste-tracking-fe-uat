import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $ } from '@wdio/globals'
import logger from '@wdio/logger'

const log = logger('defra-id-gov-uk-page')
class DefraIdGovUKPage extends Page {
  get heading() {
    return $('h1')
  }

  get signInButton() {
    return $('#sign-in-button')
  }

  get emailInput() {
    return $('#email')
  }

  get passwordInput() {
    return $('#password')
  }

  get continueButton() {
    return $("button[type='Submit']")
  }

  async verifyUserIsOnGovUKLoginPage(govUKBaseUrl) {
    this.govUKBaseUrl = govUKBaseUrl
    await expect(await this.getUrl()).toBe(
      this.govUKBaseUrl + '/sign-in-or-create'
    )
    // Wait for heading to be displayed
    await expect(this.heading).toBeDisplayed()

    // Verify the heading text
    await expect(this.heading).toHaveText(
      'Create your GOV.UK One Login or sign in'
    )
  }

  /**
   * Enter Gov.uk credentials and submit the login form
   * @param {string} email - Gov.uk email address
   * @param {string} password - Gov.uk password
   */
  async loginWithGovUK(email, password) {
    log.info(`Login with Gov.uk email: ${email}`)
    // Verify fields exist and are ready
    await this.signInButton.waitForExist({
      timeout: config.waitforTimeout
    })

    await this.signInButton.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.signInButton)

    await expect(browser).toHaveUrl(this.govUKBaseUrl + '/enter-email')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Enter your email address to sign in to your GOV.UK One Login'
    )

    await this.emailInput.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.enterText(this.emailInput, email)
    await this.continueButton.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.continueButton)

    await expect(browser).toHaveUrl(this.govUKBaseUrl + '/enter-password')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Enter your password')

    await this.passwordInput.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.enterText(this.passwordInput, password)
    await this.continueButton.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.continueButton)
  }
}

export default new DefraIdGovUKPage()
