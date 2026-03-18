import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class UploadSuccessfulPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  async verifyUserIsOnUploadSuccessfulPage(mode = 'upload') {
    await expect(browser).toHaveUrl(
      mode === 'upload'
        ? /\/organisation\/[a-zA-Z0-9-]+\/spreadsheet\/file-uploaded/
        : /\/organisation\/[a-zA-Z0-9-]+\/update-spreadsheet\/file-uploaded/
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      mode === 'upload'
        ? 'Spreadsheet upload successful'
        : 'Spreadsheet update successful'
    )
    const url = await browser.getUrl()
    const match = url.match(
      mode === 'upload'
        ? /\/organisation\/([a-zA-Z0-9-]+)\/spreadsheet\/file-uploaded/
        : /\/organisation\/([a-zA-Z0-9-]+)\/update-spreadsheet\/file-uploaded/
    )
    return match ? match[1] : null
  }

  async verifyFileHasBeenUploadedSuccessfullyToTheS3(
    apiInstance,
    organisationId,
    fileName,
    mode = 'upload'
  ) {
    await browser.waitUntil(
      async () => {
        const response = await apiInstance.getBulkUploadIdByFileName(
          organisationId,
          fileName
        )
        return response.statusCode === 200 && response.json.uploads.length > 0
      },
      {
        timeout: 30000,
        interval: 3000,
        timeoutMsg: `File "${fileName}" was not found in S3 uploads for organisation "${organisationId}" within the timeout`
      }
    )
  }

  async getProcessedFileUrl(apiInstance, organisationId, fileName) {
    let processedFileUrl = null

    await browser.waitUntil(
      async () => {
        const response = await apiInstance.getBulkUploadIdByFileName(
          organisationId,
          fileName
        )
        if (
          response.statusCode === 200 &&
          response.json.uploads.length > 0 &&
          response.json.uploads[0].processedFileUrl
        ) {
          processedFileUrl = response.json.uploads[0].processedFileUrl
          return true
        }
        return false
      },
      {
        timeout: 60000,
        interval: 5000,
        timeoutMsg: `Processed file URL was not found for "${fileName}" in organisation "${organisationId}" within the timeout`
      }
    )

    return processedFileUrl
  }
}

export default new UploadSuccessfulPage()
