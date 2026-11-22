import { $, browser } from '@wdio/globals'
import { Page } from '../page.js'
import { adminUiPageTitle } from '../../utils/software-provider-environment.js'

class ClientCredentialsPage extends Page {
  get caption() {
    return $('[data-testid="app-heading-caption"]')
  }

  get heading() {
    return $('[data-testid="app-heading-title"]')
  }

  get warning() {
    return $('[data-testid="copy-warning-alert"]')
  }

  get credentialsList() {
    return $('[data-copy-source]')
  }

  get clientId() {
    return $('[data-testid="client-id"]')
  }

  get clientSecret() {
    return $('[data-testid="client-secret"]')
  }

  get copyButton() {
    return $('[data-testid="copy-button"]')
  }

  get copyLabel() {
    return $('[data-testid="copy-button"] [data-copy-label]')
  }

  get copyStatus() {
    return $('[data-testid="copy-status"]')
  }

  get closeButton() {
    return $('[data-testid="close-button"]')
  }

  get oldSecretWarning() {
    return $('[data-testid="old-secret-warning"]')
  }

  async verifyPageIsDisplayed({
    clientName,
    environmentLabel,
    apiUrl,
    environment
  }) {
    await this.waitForPageToLoad()
    await this.verifyPageTitle(
      null,
      'en',
      adminUiPageTitle('Copy the client credentials', environment)
    )
    await expect(browser).toHaveUrl(
      expect.stringContaining('/software-providers/credentials/')
    )
    await expect(await this.caption.getTagName()).toBe('span')
    await expect(this.caption).toHaveText(clientName)
    await expect(this.heading).toHaveText('Copy the client credentials')
    await expect(this.warning.$('[data-testid="alert-heading"]')).toHaveText(
      'You must copy the credentials'
    )
    await expect(this.warning.$('[data-testid="alert-text"]')).toHaveText(
      'You cannot view the client secret after closing this page.'
    )
    await expect($('.govuk-back-link')).not.toBeExisting()

    const labels = await this.credentialsList.$$('dt')
    await expect(labels).toBeElementsArrayOfSize(4)
    await expect((await labels[0].getText()).trim()).toBe('Client ID')
    await expect((await labels[1].getText()).trim()).toBe('Client secret')
    await expect((await labels[2].getText()).trim()).toBe(environmentLabel)
    await expect((await labels[3].getText()).trim()).toBe('Generated on')

    await expect(this.clientId).toBeDisplayed()
    await expect((await this.clientId.getText()).trim()).not.toBe('')
    const secretIsShown = await browser.execute(() => {
      const secret = document.querySelector('[data-testid="client-secret"]')
      return Boolean(secret?.textContent.trim())
    })
    expect(secretIsShown).toBe(true)

    const values = await this.credentialsList.$$('dd')
    await expect((await values[2].getText()).trim()).toBe(apiUrl)
    await expect((await values[3].getText()).trim()).toMatch(
      /^\d{1,2} [A-Za-z]+ \d{4} at \d{1,2}:\d{2}(am|pm)$/
    )

    await expect(this.copyButton).toBeDisplayed()
    await expect(this.copyLabel).toHaveText('Copy credentials')
    // Its name is its text, including the visually hidden part, and starts
    // with the visible label so speech users can say it. Read from the page,
    // as not every BrowserStack driver can get the computed name
    const name = await browser.execute(
      (button) => button.textContent,
      await this.copyButton
    )
    expect(name.replace(/\s+/g, ' ').trim()).toBe(
      'Copy credentials client ID and client secret'
    )
    await expect(this.copyButton).not.toHaveAttribute('aria-label')
    await expect(this.copyStatus).toHaveAttribute('role', 'status')
    await expect(this.closeButton).toHaveText('Close')
    await expect(this.closeButton).toHaveHref(
      expect.stringContaining('/software-providers')
    )
  }

  async clientIdText() {
    return (await this.clientId.getText()).trim()
  }

  async verifyOldSecretIsNotShown() {
    await expect(this.oldSecretWarning).not.toBeExisting()
    await expect($('[data-testid="remove-old-secret"]')).not.toBeExisting()
    const values = await this.credentialsList.$$('dd')
    await expect(values).toBeElementsArrayOfSize(4)
  }

  async allowClipboardAccess() {
    const origin = await browser.execute(() => window.location.origin)
    if (typeof browser.sendCommand !== 'function') {
      return
    }

    await browser.sendCommand('Browser.grantPermissions', {
      origin,
      permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite']
    })
  }

  async clickCopy() {
    await this.allowClipboardAccess()
    await this.click(this.copyButton)
  }

  async verifyCredentialsWereCopied() {
    // The button says so, and the status, which is visually hidden, is read
    // out. Both reset after four seconds, so they're read together, retried
    // until the copy has finished
    const copiedState = () =>
      browser.execute(() => ({
        label: document
          .querySelector('[data-testid="copy-button"] [data-copy-label]')
          .textContent.trim(),
        status: document.querySelector('[data-testid="copy-status"]')
          .textContent
      }))
    let state
    await browser.waitUntil(
      async () => {
        state = await copiedState()
        return state.label === 'Credentials copied'
      },
      {
        timeout: 3000,
        timeoutMsg: 'The Copy button never said "Credentials copied"'
      }
    )
    expect(state.status).toBe('Client credentials copied')
    await this.allowClipboardAccess()
    const { copied, expected } = await browser.execute(async () => {
      const normalize = (value) => value.replace(/\r\n/g, '\n')
      const copied = normalize(await navigator.clipboard.readText())
      const labels = [...document.querySelectorAll('[data-copy-source] dt')]
      const expected = normalize(
        labels
          .map(
            (label) =>
              `${label.textContent.trim()}\n${label.nextElementSibling.textContent.trim()}`
          )
          .join('\n\n')
      )
      return { copied, expected }
    })
    expect(copied).toBe(expected)
  }

  async clickClose() {
    await this.click(this.closeButton)
  }
}

export default new ClientCredentialsPage()
