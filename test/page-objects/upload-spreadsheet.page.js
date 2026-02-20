import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class UploadSpreadsheetPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get fileUploadInput() {
    return $('#file-upload-1-input')
  }

  get fileUploadButton() {
    return $('#file-upload-1')
  }

  get uploadButton() {
    return $('button[type="submit"]')
  }

  async verifyUserIsOnUploadSpreadsheetPage() {
    await expect(browser).toHaveUrl(
      /\/organisation\/[a-zA-Z0-9-]+\/spreadsheet\/begin-upload/
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Upload a receipt of waste movement spreadsheet'
    )
  }

  async uploadSpreadsheet(spreadsheetFile) {
    const filePath = `test/data/${spreadsheetFile}`

    // Upload file to remote browser (needed for BrowserStack/Grid)
    const remoteFilePath = await browser.uploadFile(filePath)

    // Make the hidden input visible temporarily using JavaScript
    await browser.execute((inputId) => {
      const input = document.querySelector(inputId)
      if (input) {
        input.removeAttribute('hidden')
        input.removeAttribute('aria-hidden')
        input.style.display = 'block'
        input.style.visibility = 'visible'
        input.style.opacity = '1'
      }
    }, '#file-upload-1-input')

    // Now set the file path
    await this.fileUploadInput.setValue(remoteFilePath)
    await this.click(this.uploadButton)
  }

  async verifyFileIsSelected(filename) {
    // Verify the hidden input has a value
    const value = await this.fileUploadInput.getValue()
    expect(value).toContain(filename)
  }
}

export default new UploadSpreadsheetPage()
