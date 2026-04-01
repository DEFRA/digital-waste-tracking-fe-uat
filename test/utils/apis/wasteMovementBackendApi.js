import { BaseAPI } from './base-api.js'

export class WasteMovementBackendAPI extends BaseAPI {
  constructor(baseUrl, httpProxy) {
    super(baseUrl, httpProxy)
    // Create Basic Authorization header with base64 encoded credentials
    const credentials = `waste-organisation-backend:${process.env.WASTE_MOVEMENT_BACKEND_PASSWORD}`
    this.base64Credentials = Buffer.from(credentials).toString('base64')
  }

  async getWasteMovementRecordsByBulkId(bulkId) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (process.env.xapikey) {
      requestHeaders['x-api-key'] = process.env.xapikey
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
