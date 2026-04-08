import { browser } from '@wdio/globals'

/**
 * Handles async backend polling operations that are independent of page UI.
 * Extracted from UploadSuccessfulPage to satisfy Single Responsibility Principle.
 */
export class AsyncUploadProcessHandler {
  async waitForUploadId(
    apiInstance,
    organisationId,
    fileName,
    timeoutMs = 30000
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
          response.json.uploads[0].referenceNumber
        ) {
          uploadId = response.json.uploads[0].referenceNumber
          return true
        }
        return false
      },
      {
        timeout: timeoutMs,
        interval: 3000,
        timeoutMsg: `File "${fileName}" was not found in S3 uploads for organisation "${organisationId}" within the timeout`
      }
    )

    return uploadId
  }

  async waitForRejection(
    apiInstance,
    organisationId,
    fileName,
    expectedErrorMessage,
    timeoutMs = 30000
  ) {
    let actualErrorMessage = null
    let uploadId = null

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
          uploadId = upload.uploadId ?? null
          return true
        }
        return false
      },
      {
        timeout: timeoutMs,
        interval: 3000,
        timeoutMsg: `File "${fileName}" was not rejected with an error for organisation "${organisationId}" within the timeout`
      }
    )

    if (expectedErrorMessage) {
      expect(actualErrorMessage).toBe(expectedErrorMessage)
    }

    return { uploadId, errorMessage: actualErrorMessage }
  }

  async waitForWasteMovementRecords(
    wasteMovementBackendAPI,
    uploadId,
    timeoutMs = 30000
  ) {
    let json = null

    try {
      await browser.waitUntil(
        async () => {
          const response =
            await wasteMovementBackendAPI.getWasteMovementRecordsByBulkId(
              uploadId
            )
          json = response.json
          return response.statusCode !== 404
        },
        {
          timeout: timeoutMs,
          interval: 3000,
          timeoutMsg: `Waste movement records for uploadId "${uploadId}" were not found within ${timeoutMs / 1000}s`
        }
      )
    } catch {
      // Timeout: return last response body (e.g. 404 payload) for debugging / assertions
    }

    return json
  }

  async waitForProcessedFileUrl(
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

export default new AsyncUploadProcessHandler()
