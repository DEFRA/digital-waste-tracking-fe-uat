import { BaseAPI } from './base-api.js'

export class GovPayAPI extends BaseAPI {
  setAuthorizationHeader(apiKey) {
    this.defaultHeaders.Authorization = `Bearer ${apiKey}`
  }

  async getPaymentStatus(paymentId) {
    const { statusCode, headers, json } = await this.get(`/${paymentId}`, {
      'Content-Type': 'application/json'
    })

    return { statusCode, headers, json }
  }

  async issueARefund(paymentId, refundAmountAvailable = 2600) {
    const { statusCode, headers, json } = await this.post(
      `/${paymentId}/refunds`,
      JSON.stringify({
        amount: 26,
        refund_amount_available: refundAmountAvailable
      }),
      { 'Content-Type': 'application/json' }
    )

    return { statusCode, headers, json }
  }
}
