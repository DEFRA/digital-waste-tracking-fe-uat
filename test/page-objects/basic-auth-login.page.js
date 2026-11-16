import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class BasicAuthLoginPage extends Page {
  get usernameInput() {
    return $('#username')
  }

  get passwordInput() {
    return $('#password')
  }

  get loginButton() {
    return $('#login-form button[type="submit"]')
  }

  async isCurrentPage() {
    return (await browser.getTitle()) === 'Login Form | Report receipt of waste'
  }

  async login(username, password) {
    await this.usernameInput.waitForDisplayed()
    await this.enterText(this.usernameInput, username)
    await this.enterText(this.passwordInput, password)
    await this.click(this.loginButton)
  }
}

export default new BasicAuthLoginPage()
