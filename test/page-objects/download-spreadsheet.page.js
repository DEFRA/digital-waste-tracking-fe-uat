import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import { homedir, platform } from 'node:os'
import { join } from 'node:path'
import fs from 'fs'

function getDefaultDownloadsDir() {
  const home = homedir()
  switch (platform()) {
    case 'win32':
      return join(home, 'Downloads')
    case 'darwin':
    case 'linux':
    default:
      return join(home, 'Downloads')
  }
}

class DownloadSpreadsheetPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get downloadButton() {
    return $('a[data-testid="download-spreadsheet-button"]')
  }

  async verifyUserIsOnDownloadSpreadsheetPage() {
    await expect(browser).toHaveUrl(/\/download-spreadsheet/)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Download Receipt of waste spreadsheet'
    )
  }

  async downloadSpreadsheet() {
    this.click(this.downloadButton)
    // giving time for the file to be downloaded
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(1000)
  }

  async verifySpreadsheetIsDownloaded() {
    const downloadsDir = getDefaultDownloadsDir()
    const filePath = join(downloadsDir, 'receipt-of-waste-template.xlsx')
    await expect(fs.existsSync(filePath)).toBe(true)
  }
}

export default new DownloadSpreadsheetPage()
