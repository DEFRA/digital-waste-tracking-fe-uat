import { BaseAPI } from './base-api.js'

export class WasteOrganisationBackendAPI extends BaseAPI {
  constructor(baseUrl, httpProxy) {
    super(baseUrl, httpProxy)
    // Create Basic Authorization header with base64 encoded credentials
    const credentials = `WASTE_MOVEMENT_EXTERNAL_API:${process.env.ORGANISATION_BACKEND_PASSWORD}`
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
    // this will ever be added only when running test from local machine
    if (process.env.xapikey) {
      requestHeaders['x-api-key'] = process.env.xapikey
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
    // this will ever be added only when running test from local machine
    if (process.env.xapikey) {
      requestHeaders['x-api-key'] = process.env.xapikey
    }

    const { statusCode, headers, json } = await this.post(
      `/organisation/${organisationId}/apiCodes`,
      JSON.stringify({ name: 'org1' }),
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
  async disableApiCodeForOrganisation(organisationId, apiCode) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (process.env.xapikey) {
      requestHeaders['x-api-key'] = process.env.xapikey
    }

    const { statusCode, headers, json } = await this.put(
      `/organisation/${organisationId}/apiCodes/${apiCode}`,
      JSON.stringify({
        apiCode: {
          isDisabled: true
        }
      }),
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
  async getAllApiCodesForOrganisation(organisationId) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (process.env.xapikey) {
      requestHeaders['x-api-key'] = process.env.xapikey
    }

    const { statusCode, headers, json } = await this.get(
      `/organisation/${organisationId}/apiCodes`,
      requestHeaders
    )

    return {
      statusCode,
      headers,
      json
    }
  }
}
