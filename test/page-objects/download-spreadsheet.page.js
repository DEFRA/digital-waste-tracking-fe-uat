import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import logger from '@wdio/logger'
import {
  downloadLinkViaBrowserFetch,
  downloadViaSelenium,
  supportsSeleniumFileDownloads,
  waitForSeleniumDownloadedFile
} from '../utils/browser-file-download.js'

const log = logger('download-spreadsheet-page')

class DownloadSpreadsheetPage extends Page {
  expectedFileName = 'receipt-of-waste-template.xlsx'
  downloadButtonSelector = 'a[data-testid="download-spreadsheet-button"]'

  // locators
  get heading() {
    return $('h1')
  }

  get downloadButton() {
    return $(this.downloadButtonSelector)
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
    log.info(`downloading spreadsheet: ${this.expectedFileName}`)
    await expect(this.downloadButton).toBeDisplayed()

    if (supportsSeleniumFileDownloads()) {
      await downloadViaSelenium({
        clickDownload: () => this.click(this.downloadButton),
        fileName: this.expectedFileName
      })
      return
    }

    // BrowserStack: Selenium managed downloads are unavailable.
    // Capture the file via in-browser fetch (same approach as admin CSV).
    this.browserFetchDownload = await downloadLinkViaBrowserFetch({
      selector: this.downloadButtonSelector,
      responseType: 'base64'
    })
  }

  async verifySpreadsheetIsDownloaded() {
    if (supportsSeleniumFileDownloads()) {
      const fileName = await waitForSeleniumDownloadedFile({
        fileName: this.expectedFileName
      })
      await expect(fileName).toBe(this.expectedFileName)
      return
    }

    const result =
      this.browserFetchDownload ??
      (await downloadLinkViaBrowserFetch({
        selector: this.downloadButtonSelector,
        responseType: 'base64'
      }))

    const downloadedName = result.fileName ?? this.expectedFileName
    await expect(downloadedName).toBe(this.expectedFileName)
    await expect(result.content.length).toBeGreaterThan(0)
  }
}

export default new DownloadSpreadsheetPage()
