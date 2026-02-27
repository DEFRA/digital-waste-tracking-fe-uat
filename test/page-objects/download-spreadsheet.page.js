import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import logger from '@wdio/logger'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// function getDefaultDownloadsDir() {
//   const home = homedir()
//   switch (platform()) {
//     case 'win32':
//       return join(home, 'Downloads')
//     case 'darwin':
//     case 'linux':
//     default:
//       return join(home, 'Downloads')
//   }
// }

async function waitForFileExists(filePath, currentTime = 0, timeout = 5000) {
  if (fs.existsSync(filePath)) return true
  if (currentTime === timeout) return false
  // wait for 1 second
  await new Promise((resolve, reject) => setTimeout(() => resolve(true), 1000))
  // waited for 1 second
  return waitForFileExists(filePath, currentTime + 1000, timeout)
}

const log = logger('download-spreadsheet-page')
class DownloadSpreadsheetPage extends Page {
  downloadsDir = path.resolve(__dirname, '../../test/data')
  filePath = path.join(this.downloadsDir, 'receipt-of-waste-template.xlsx')

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
    // delete the file if it exists
    if (fs.existsSync(this.filePath)) {
      fs.unlinkSync(this.filePath)
    }
    log.info(`downloading spreadsheet to ${this.filePath}`)
    this.click(this.downloadButton)
  }

  async verifySpreadsheetIsDownloaded() {
    // giving time for the file to be downloaded
    await waitForFileExists(this.filePath)
    await expect(fs.existsSync(this.filePath)).toBe(true)
  }
}

export default new DownloadSpreadsheetPage()
