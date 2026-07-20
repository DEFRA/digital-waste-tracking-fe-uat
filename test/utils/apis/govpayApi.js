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

    return { statusCode, headers, json }
  }

  async issueARefund(paymentReference, refundAmount = 26) {
    const { statusCode, headers, json } = await this.post(
      `/${paymentReference}/refunds`,
      JSON.stringify({
        amount: refundAmount,
        refund_amount_available: 2600
      }),
      { 'Content-Type': 'application/json' }
    )

    return { statusCode, headers, json }
  }
}
