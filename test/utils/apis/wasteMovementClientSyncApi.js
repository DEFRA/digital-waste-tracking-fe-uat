import { randomUUID } from 'node:crypto'
import { BaseAPI } from './base-api.js'

/** Default tenant service used by client-sync UAT flows. */
export const DEFAULT_TENANT_SERVICE_NAME = 'waste-movement-external-api'

/**
 * Client for the DWT client-sync service.
 * GET /clients/{tenantServiceName} and DELETE /clients/{tenantServiceName}/{clientId}.
 */
export class WasteMovementClientSyncAPI extends BaseAPI {
  /**
   * @param {string} baseUrl
   * @param {string|undefined} httpProxy
   * @param {import('../../setup/test-env.js').TestEnv} testEnv
   */
  constructor(baseUrl, httpProxy, testEnv) {
    super(baseUrl, httpProxy)
    this.testEnv = testEnv
  }

  /**
   * GET /clients/{tenantServiceName} — list all clients for a tenant service.
   * @param {string} [tenantServiceName=DEFAULT_TENANT_SERVICE_NAME] - Tenant service name
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async getClients(tenantServiceName = DEFAULT_TENANT_SERVICE_NAME) {
    const { statusCode, headers, json } = await this.get(
      `/clients/${encodeURIComponent(tenantServiceName)}`,
      this.#requestHeaders()
    )
    return { statusCode, headers, json }
  }

  /**
   * DELETE /clients/{tenantServiceName}/{clientId} — delete a client.
   * A successful delete is 204 with no body. Pass returnsNoContent so json is undefined.
   * Error responses are JSON, so leave returnsNoContent false for those calls.
   * @param {string} clientId - Cognito / software-provider client ID
   * @param {boolean} [returnsNoContent=false] - When true, do not parse the body and return json as undefined
   * @param {string} [tenantServiceName=DEFAULT_TENANT_SERVICE_NAME] - Tenant service name
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async deleteClient(
    clientId,
    returnsNoContent = false,
    tenantServiceName = DEFAULT_TENANT_SERVICE_NAME
  ) {
    const { statusCode, headers, json } = await this.delete(
      `/clients/${encodeURIComponent(tenantServiceName)}/${encodeURIComponent(clientId)}`,
      this.#requestHeaders(),
      returnsNoContent
    )
    return { statusCode, headers, json }
  }

  /**
   * Basic auth for the tenant, plus the CDP API key when one is set.
   * @returns {Record<string, string>}
   */
  #requestHeaders() {
    const credentials = `${DEFAULT_TENANT_SERVICE_NAME}:${this.testEnv.serviceAuthPassword}`
    const requestHeaders = {
      Authorization: `Basic ${Buffer.from(credentials).toString('base64')}`,
      'x-cdp-request-id': randomUUID()
    }
    const apiKey = this.testEnv.cdpDevApiKey ?? this.testEnv.xApiKey
    if (apiKey) requestHeaders['x-api-key'] = apiKey
    return requestHeaders
  }
}
