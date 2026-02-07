import { Page } from 'page-objects/page'
import { config } from '../../wdio.conf.js'
import { $, browser } from '@wdio/globals'
import logger from '@wdio/logger'
import { v4 as uuidv4 } from 'uuid'

const log = logger('defra-id-stub-page')
class DefraIdStubPage extends Page {
  get heading() {
    return $('span.govuk-caption-m')
  }

  get newRegistrationLink() {
    return $('.govuk-link')
  }

  get userIdInput() {
    return $('#userId')
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

  get relationshipIdInput() {
    return $('#relationshipId')
  }

  get organisationNameInput() {
    return $('#organisationName')
  }

  get organisationIdInput() {
    return $('#organisationId')
  }

  get finishLink() {
    return $('=Finish')
  }

  get loginLink() {
    return $('=Login')
  }

  get userList() {
    return $$('.govuk-table__row>th')
  }

  // Select your organisation
  get selectFirstOrganisationRadioButton() {
    return $('#relationshipId')
  }

  get getFirstOrganisationIdInput() {
    return $('#relationshipId-item-hint')
  }

  async registerNewUser(email) {
    log.info(`Register with email: ${email}`)

    await expect(browser).toHaveUrl(
      'https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/register'
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('DEFRA ID Stub User Set Up')

    await this.emailInput.waitForExist({
      timeout: config.waitforTimeout
    })

    const userId = await this.userIdInput.getValue()

    await this.enterText(this.emailInput, email)
    await this.enterText(this.firstNameInput, 'PTest')
    await this.enterText(this.lastNameInput, 'PLast')
    await this.enterText(this.enrolmentNumberInput, '1')
    await this.enterText(this.enrolmentRequestCountInput, '1')
    await this.continueButton.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.continueButton)

    await expect(browser).toHaveUrl(
      `https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/register/${userId}/relationship`
    )

    await this.relationshipIdInput.waitForExist({
      timeout: config.waitforTimeout
    })

    await this.enterText(this.relationshipIdInput, uuidv4())
    await this.enterText(this.organisationNameInput, 'POrganisation')
    await this.enterText(this.organisationIdInput, uuidv4())

    await this.continueButton.waitForClickable({
      timeout: config.waitforTimeout
    })
    await this.click(this.continueButton)

    await expect(browser).toHaveUrl(
      `https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/register/${userId}/relationship`
    )

    await this.finishLink.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.finishLink.click()

    await expect(browser).toHaveUrl(
      `https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/register/${userId}/summary`
    )

    await this.loginLink.waitForExist({
      timeout: config.waitforTimeout
    })
    await this.loginLink.click()

    // assert user was created successfully
    await expect(browser).toHaveUrl(
      `https://cdp-defra-id-stub.dev.cdp-int.defra.cloud/cdp-defra-id-stub/login`
    )
    const userList = await this.userList.getElements()
    const users = await userList.map(async (user) => await user.getText())
    expect(users).toContain(email)
  }

  async loginAsAUser(email) {
    log.info(`Logging in as a user with email: ${email}`)
    const userList = await this.userList.getElements()

    // Find the user row with the matching email
    let userRow = null
    for (const user of userList) {
      const userText = await user.getText()
      if (userText === email) {
        // Get the parent row and then the action cell
        userRow = await user.parentElement().$('td:nth-child(2)>a')
        break
      }
    }

    if (!userRow) {
      throw new Error(`User with email "${email}" not found in the user list`)
    }

    // Wait for element to be displayed before scrolling
    await userRow.waitForDisplayed({ timeout: config.waitforTimeout })
    await userRow.scrollIntoView({ block: 'center', behavior: 'smooth' })
    await userRow.waitForClickable({ timeout: config.waitforTimeout })
    await userRow.click()

    await expect(browser).toHaveUrl(
      /https:\/\/cdp-defra-id-stub\.dev\.cdp-int\.defra\.cloud\/cdp-defra-id-stub\/organisations/
    )
  }

  async selectFirstOrganisation() {
    await this.selectFirstOrganisationRadioButton.click()
    await this.continueButton.click()
  }

  async getFirstOrganisationId() {
    return await this.getFirstOrganisationIdInput.getText()
  }
}

export default new DefraIdStubPage()
