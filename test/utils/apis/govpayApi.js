import { BaseAPI } from './base-api.js'

export class GovPayAPI extends BaseAPI {
  setAuthorizationHeader(apiKey) {
    this.defaultHeaders.Authorization = `Bearer ${apiKey}`
  }

  async getPaymentStatus(paymentReference) {
    const { statusCode, headers, json } = await this.get(
      `/${paymentReference}`,
      { 'Content-Type': 'application/json' }
    )

    return {
      statusCode,
      headers,
      json
    }
  }
}
