import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class UploadSuccessfulPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  get referenceNumber() {
    return $('.govuk-panel__body')
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
    await expect(this.referenceNumber).toBeDisplayed()
    await expect(this.referenceNumber).toHaveText(
      /Your reference number\s+[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}/i
    )
    const url = await browser.getUrl()
    const urlMatch = url.match(
      mode === 'upload'
        ? /\/organisation\/([a-zA-Z0-9-]+)\/spreadsheet\/file-uploaded/
        : /\/organisation\/([a-zA-Z0-9-]+)\/update-spreadsheet\/file-uploaded/
    )
    const referenceNumberText = await this.referenceNumber.getText()
    const refMatch = referenceNumberText.match(
      /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})/i
    )
    return {
      organisationId: urlMatch ? urlMatch[1] : null,
      referenceNumber: refMatch ? refMatch[1] : null
    }
  }

  async verifyFileHasBeenUploadedSuccessfullyToTheS3(
    apiInstance,
    organisationId,
    fileName,
    mode = 'upload'
  ) {
    let uploadId = null

    await browser.waitUntil(
      async () => {
        const response = await apiInstance.getBulkUploadIdByFileName(
          organisationId,
          fileName
        )
        if (
          response.statusCode === 200 &&
          response.json.uploads.length > 0 &&
          response.json.uploads[0].uploadId
        ) {
          uploadId = response.json.uploads[0].uploadId
          return true
        }
        return false
      },
      {
        timeout: 30000,
        interval: 3000,
        timeoutMsg: `File "${fileName}" was not found in S3 uploads for organisation "${organisationId}" within the timeout`
      }
    )

    return uploadId
  }

  async verifyFileHasBeenRejectedAndNotUploadedToS3(
    apiInstance,
    organisationId,
    fileName,
    expectedErrorMessage
  ) {
    let actualErrorMessage = null

    await browser.waitUntil(
      async () => {
        const response = await apiInstance.getBulkUploadIdByFileName(
          organisationId,
          fileName
        )
        const upload = response.json?.uploads?.[0]
        if (
          response.statusCode === 200 &&
          upload?.hasError === true &&
          upload?.errorMessage
        ) {
          actualErrorMessage = upload.errorMessage
          return true
        }
        return false
      },
      {
        timeout: 30000,
        interval: 3000,
        timeoutMsg: `File "${fileName}" was not rejected with an error for organisation "${organisationId}" within the timeout`
      }
    )

    if (expectedErrorMessage) {
      expect(actualErrorMessage).toBe(expectedErrorMessage)
    }

    return actualErrorMessage
  }

  async getProcessedFileUrl(
    apiInstance,
    organisationId,
    fileName,
    timeoutMs = 60000
  ) {
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
        timeout: timeoutMs,
        interval: 5000,
        timeoutMsg: `Processed file URL was not found for "${fileName}" in organisation "${organisationId}" within ${timeoutMs / 1000}s`
      }
    )

    return processedFileUrl
  }
}

export default new UploadSuccessfulPage()
