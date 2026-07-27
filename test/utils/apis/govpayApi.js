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

  async issueARefund(
    paymentId,
    refundAmount = 2600,
    refundAmountAvailable = refundAmount
  ) {
    const { statusCode, headers, json } = await this.post(
      `/${paymentId}/refunds`,
      JSON.stringify({
        amount: refundAmount,
        refund_amount_available: refundAmountAvailable
      }),
      { 'Content-Type': 'application/json' }
    )

    return { statusCode, headers, json }
  }
}
