import { createHmac } from 'crypto'
import { BaseAPI } from './base-api.js'

export class WasteOrganisationFrontendAPI extends BaseAPI {
  /**
   * Invokes the GOV.UK Pay webhook callback endpoint on the frontend service.
   * Computes a Pay-Signature HMAC so the frontend can verify the payload.
   * @param {string} paymentReference
   * @param {string} webhookSigningSecret
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async invokeWebhookForRefund(
    paymentReference,
    organisationId,
    paymentId,
    webhookSigningSecret
  ) {
    if (!webhookSigningSecret) {
      throw new Error(
        'GOVPAY_WEBHOOK_SIGNING_SECRET is not set. Run: source env.sh before starting the test suite.'
      )
    }

    const webhookMessageBody = {
      webhook_message_id: 'bfh6j3fb5r4sjpmvhg7ffvdda0',
      created_date: '2026-07-15T10:37:56.771Z',
      resource_id: paymentId,
      api_version: 1,
      resource_type: 'PAYMENT',
      event_type: 'card_payment_refunded',
      resource: {
        moto: false,
        email: 'padmaja.gandham@equalexperts.com',
        state: {
          status: 'success',
          finished: true
        },
        amount: 2600,
        language: 'en',
        metadata: {
          organisationId,
          organisationName: 'test org',
          servicePeriodEnd: '2027-10-01T00:00:00.000Z',
          servicePeriodStart: '2026-10-01T00:00:00.000Z'
        },
        reference: paymentReference,
        payment_id: paymentReference,
        return_url: `${this.baseUrl}/payment-details`,
        description: 'Annual report receipt of waste service charge',
        card_details: {
          card_type: 'credit',
          card_brand: 'Visa',
          expiry_date: '12/27',
          billing_address: {
            city: 'London',
            line1: '69',
            line2: '',
            country: 'GB',
            postcode: 'sl38dp'
          },
          cardholder_name: 'Ptest',
          last_digits_card_number: '1111',
          first_digits_card_number: '444433'
        },
        created_date: '2026-07-15T10:36:25.636Z',
        refund_summary: {
          status: 'full',
          amount_available: 0,
          amount_submitted: 2600
        },
        delayed_capture: false,
        payment_provider: 'sandbox',
        settlement_summary: {
          captured_date: '2026-07-15',
          capture_submit_time: '2026-07-15T10:36:40.939Z'
        },
        authorisation_summary: {
          three_d_secure: {
            required: false
          }
        }
      }
    }

    const webhookMessageBodyJson = JSON.stringify(webhookMessageBody)
    const hmac = createHmac('sha256', webhookSigningSecret)
      .update(webhookMessageBodyJson)
      .digest('hex')

    const { statusCode, headers, json } = await this.post(
      '/service-charge-callback',
      webhookMessageBodyJson,
      { 'Content-Type': 'application/json', 'Pay-Signature': hmac }
    )

    return { statusCode, headers, json }
  }
}
