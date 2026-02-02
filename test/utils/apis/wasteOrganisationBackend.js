import { BaseAPI } from './base-api.js'

export class WasteMovementBackendAPI extends BaseAPI {
  constructor(baseUrl, httpProxy, orgBackendServicePassword) {
    super(baseUrl, httpProxy)
    // Create Basic Authorization header with base64 encoded credentials
    const credentials = `WASTE_MOVEMENT_EXTERNAL_API:${orgBackendServicePassword}`
    this.base64Credentials = Buffer.from(credentials).toString('base64')
  }

  /**
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async getOrganisationByApiCode(apiCode) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }

    const { statusCode, headers, json } = await this.get(
      `/organisation/${apiCode}`,
      requestHeaders
    )

    return {
      statusCode,
      headers,
      json
    }
  }

  /**
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async createApiCodeForOrganisation(organisationId) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }

    const { statusCode, headers, json } = await this.post(
      `/organisation/${organisationId}/apiCodes`,
      { name: 'org1' },
      requestHeaders
    )

    return {
      statusCode,
      headers,
      json
    }
  }
}
