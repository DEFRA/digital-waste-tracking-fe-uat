import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import path from 'node:path'
import fs from 'node:fs'

class UploadSpreadsheetPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get fileUploadInput() {
    return $('#file-upload-1')
  }

  get uploadButton() {
    return $('button[type="submit"]')
  }

  async verifyUserIsOnUploadSpreadsheetPage(mode = 'upload') {
    await expect(browser).toHaveUrl(
      mode === 'upload'
        ? /\/organisation\/[a-zA-Z0-9-]+\/spreadsheet\/begin-upload/
        : /\/organisation\/[a-zA-Z0-9-]+\/update-spreadsheet\/begin-upload/
    )
    await this.elementIsDisplayed(this.heading)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      mode === 'upload'
        ? 'Upload a receipt of waste movement spreadsheet'
        : 'Update an existing spreadsheet'
    )
  }

  async uploadSpreadsheet(spreadsheetFile, mode = 'upload') {
    const filePath = `test/data/${spreadsheetFile}`

    // Create a timestamped copy in the same directory (e.g. template.xlsx -> template.1709567890123.xlsx)
    const dir = path.dirname(filePath)
    const { name: baseName, ext } = path.parse(filePath)
    const fileName = `${baseName}_${Date.now()}${ext}`
    const copyPath = path.join(dir, fileName)
    fs.copyFileSync(filePath, copyPath)

    // Upload file to remote browser (needed for BrowserStack/Grid)
    const remoteFilePath = await browser.uploadFile(copyPath)

    // Now set the file path
    await this.fileUploadInput.setValue(remoteFilePath)
    await this.click(this.uploadButton)
    return fileName
  }

  async verifyFileIsSelected(filename) {
    // Verify the hidden input has a value
    const value = await this.fileUploadInput.getValue()
    expect(value).toContain(filename)
  }
}

export default new UploadSpreadsheetPage()
