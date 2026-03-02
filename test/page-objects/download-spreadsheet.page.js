import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import { fileURLToPath } from 'node:url'
import path from 'node:path'
import fs from 'fs'
import logger from '@wdio/logger'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

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
    await browser.waitUntil(() => fs.existsSync(this.filePath), {
      timeout: 15000,
      timeoutMsg: `Spreadsheet did not download in time`
    })
    // also adding an explicit pause to see if it is an issue with wait
    // ToDo:remove thie after debugging******
    // eslint-disable-next-line wdio/no-pause
    await browser.pause(10000)
    await expect(fs.existsSync(this.filePath)).toBe(true)
  }
}

export default new DownloadSpreadsheetPage()
