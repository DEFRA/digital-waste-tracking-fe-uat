import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
// import { fileURLToPath } from 'node:url'
// import path from 'node:path'
import logger from '@wdio/logger'

// const __dirname = path.dirname(fileURLToPath(import.meta.url))
const log = logger('download-spreadsheet-page')

class DownloadSpreadsheetPage extends Page {
  expectedFileName = 'receipt-of-waste-template.xlsx'
  // /** Directory on the machine running the test where downloadFile() saves the file */
  // downloadsDir = path.resolve(__dirname, '../../test/data')

  // locators
  get heading() {
    return $('h1')
  }

  get downloadButton() {
    return $('a[data-testid="download-spreadsheet-button"]')
  }

  get metaData() {
    return $('#file-metadata')
  }

  async verifyUserIsOnDownloadSpreadsheetPage() {
    await this.verifyPageTitle(
      'Download Receipt of waste spreadsheet | Report receipt of waste'
    )
    await expect(browser).toHaveUrl(/\/download-spreadsheet/)
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      'Download Receipt of waste spreadsheet'
    )
    await expect(this.metaData).toBeDisplayed()
    await expect(this.metaData).toHaveText('XLSX, 428KB')
  }

  async downloadSpreadsheet() {
    // delete the file if it exists
    await browser.deleteDownloadableFiles()

    log.info(`downloading spreadsheet: ${this.expectedFileName}`)
    await this.click(this.downloadButton)
  }

  async verifySpreadsheetIsDownloaded() {
    await browser.waitUntil(
      async () => {
        const { names } = await browser.getDownloadableFiles()
        return names.includes(this.expectedFileName)
      },
      {
        timeout: 15000,
        timeoutMsg: `Spreadsheet "${this.expectedFileName}" did not appear in downloadable files in time`
      }
    )
    const { names } = await browser.getDownloadableFiles()
    await expect(names).toContain(this.expectedFileName)
    // Todo: to be used in future
    // await browser.downloadFile(this.expectedFileName, this.downloadsDir)
  }
}

export default new DownloadSpreadsheetPage()
