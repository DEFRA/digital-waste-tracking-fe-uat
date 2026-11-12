import { randomUUID } from 'node:crypto'
import { BaseAPI } from './base-api.js'

/** Default tenant service used by client-sync UAT flows. */
export const DEFAULT_TENANT_SERVICE_NAME = 'waste-movement-external-api'

/**
 * Same xapikey → ephemeral-protected rule as ApiFactory for org/movement backends.
 * @param {string} configBaseUrl - wasteMovementClientSyncApiBaseUrl from env config
 * @param {NodeJS.ProcessEnv} [env=process.env]
 * @returns {string}
 */
export function resolveWasteMovementClientSyncBaseUrl(
  configBaseUrl,
  env = process.env
) {
  if (env.xapikey) {
    return `https://ephemeral-protected.api.${env.ENVIRONMENT}.cdp-int.defra.cloud/dwt-client-sync`
  }
  return configBaseUrl
}

/**
 * Client for the DWT client-sync service.
 * GET /clients/{tenantServiceName} and DELETE /clients/{tenantServiceName}/{clientId}.
 */
export class WasteMovementClientSyncAPI extends BaseAPI {
  /**
   * GET /clients/{tenantServiceName} — list all clients for a tenant service.
   * @param {string} [tenantServiceName=DEFAULT_TENANT_SERVICE_NAME] - Tenant service name
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async getClients(tenantServiceName = DEFAULT_TENANT_SERVICE_NAME) {
    const credentials = `${DEFAULT_TENANT_SERVICE_NAME}:${process.env.SERVICE_AUTH_PASSWORD}`
    const base64Credentials = Buffer.from(credentials).toString('base64')
    const requestHeaders = {
      Authorization: `Basic ${base64Credentials}`,
      'x-cdp-request-id': randomUUID()
    }
    const apiKey = process.env.CDP_DEV_API_KEY ?? process.env.xapikey
    if (apiKey != null && apiKey !== '') {
      requestHeaders['x-api-key'] = apiKey
    }
    const { statusCode, headers, json } = await this.get(
      `/clients/${encodeURIComponent(tenantServiceName)}`,
      requestHeaders
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
    const credentials = `${DEFAULT_TENANT_SERVICE_NAME}:${process.env.SERVICE_AUTH_PASSWORD}`
    const base64Credentials = Buffer.from(credentials).toString('base64')
    const requestHeaders = {
      Authorization: `Basic ${base64Credentials}`,
      'x-cdp-request-id': randomUUID()
    }
    const apiKey = process.env.CDP_DEV_API_KEY ?? process.env.xapikey
    if (apiKey != null && apiKey !== '') {
      requestHeaders['x-api-key'] = apiKey
    }
    const { statusCode, headers, json } = await this.delete(
      `/clients/${encodeURIComponent(tenantServiceName)}/${encodeURIComponent(clientId)}`,
      requestHeaders,
      returnsNoContent
    )
    return { statusCode, headers, json }
  }
}
