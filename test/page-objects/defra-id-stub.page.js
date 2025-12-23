import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $, browser } from '@wdio/globals'
import logger from '@wdio/logger'

const log = logger('defra-id-stub-page')
class DefraIdStubPage extends Page {
  get heading() {
    return $('span.govuk-caption-m')
  }

  get newRegistrationLink() {
    return $('.govuk-link')
  }

  get emailInput() {
    return $('#email')
  }

  get firstNameInput() {
    return $('#firstName')
  }

  get lastNameInput() {
    return $('#lastName')
  }

  get enrolmentNumberInput() {
    return $('#enrolmentCount')
  }

  get enrolmentRequestCountInput() {
    return $('#enrolmentRequestCount')
  }

  get continueButton() {
    return $("button[type='Submit']")
  }

  async registerNewUser(email) {
    log.info(`Register with email: ${email}`)
    // Verify fields exist and are ready
    await this.newRegistrationLink.waitForExist({
      timeout: config.waitforTimeout
    })

    await this.newRegistrationLink.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.newRegistrationLink)

    await expect(browser).toHaveUrl(
      'https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/register'
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('DEFRA ID Stub User Set Up')

    await this.emailInput.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.enterText(this.emailInput, email)
    await this.enrolmentNumberInput.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.enterText(this.enrolmentNumberInput, '1')
    await this.enrolmentRequestCountInput.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.enterText(this.enrolmentRequestCountInput, '1')
    await this.continueButton.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.continueButton)

    // // ToDo: When 500 error issue is fixed in dev
    // // await expect(browser).toHaveUrl(this.govUKBaseUrl + '/enter-password')
    // // await expect(this.heading).toBeDisplayed()
    // // await expect(this.heading).toHaveText('xxxx')
  }
}

export default new DefraIdStubPage()
