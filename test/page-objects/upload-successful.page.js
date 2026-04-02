import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'
import AsyncUploadProcessHandler from '../utils/AsyncProcessHandler.js'

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
    return AsyncUploadProcessHandler.waitForUploadId(
      apiInstance,
      organisationId,
      fileName
    )
  }

  async verifyFileHasBeenRejectedAndNotUploadedToS3(
    apiInstance,
    organisationId,
    fileName,
    expectedErrorMessage
  ) {
    return AsyncUploadProcessHandler.waitForRejection(
      apiInstance,
      organisationId,
      fileName,
      expectedErrorMessage
    )
  }

  async getProcessedFileUrl(
    apiInstance,
    organisationId,
    fileName,
    timeoutMs = 60000
  ) {
    return AsyncUploadProcessHandler.waitForProcessedFileUrl(
      apiInstance,
      organisationId,
      fileName,
      timeoutMs
    )
  }
}

export default new UploadSuccessfulPage()
