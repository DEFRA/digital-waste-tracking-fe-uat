import { BaseAPI } from './base-api.js'

export class WasteMovementBackendAPI extends BaseAPI {
  /**
   * @param {string} baseUrl
   * @param {string|undefined} httpProxy
   * @param {import('../../setup/test-env.js').TestEnv} testEnv
   */
  constructor(baseUrl, httpProxy, testEnv) {
    super(baseUrl, httpProxy)
    this.testEnv = testEnv
    // Create Basic Authorization header with base64 encoded credentials
    const credentials = `qa-non-prod:${this.testEnv.wasteMovementBackendPassword}`
    this.base64Credentials = Buffer.from(credentials).toString('base64')
  }

  async getWasteMovementRecordsByBulkId(bulkId) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
    }

    const { statusCode, headers, json } = await this.get(
      `/qa-non-prod/movements?bulkId=${bulkId}`,
      requestHeaders
    )

    return {
      statusCode,
      headers,
      json
    }
  }
}
