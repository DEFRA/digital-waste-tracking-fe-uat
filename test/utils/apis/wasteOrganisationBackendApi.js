import { BaseAPI } from './base-api.js'

export class WasteOrganisationBackendAPI extends BaseAPI {
  /**
   * @param {string} baseUrl
   * @param {string|undefined} httpProxy
   * @param {import('../../setup/test-env.js').TestEnv} testEnv
   */
  constructor(baseUrl, httpProxy, testEnv) {
    super(baseUrl, httpProxy)
    this.testEnv = testEnv
    // Create Basic Authorization header with base64 encoded credentials
    const credentials = `WASTE_MOVEMENT_EXTERNAL_API:${this.testEnv.organisationBackendPassword}`
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
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
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

  async createOrganisation(organisationId) {
    const { statusCode, headers, json } = await this.updateOrganisationDetails(
      organisationId,
      {
        organisation: {
          name: 'Some Org1',
          users: ['75cec841-8414-42f2-aff2-7e9750a5bd4c']
        }
      }
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
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
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
  async updateOrganisationDetails(organisationId, payload) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
    }

    // leaving the userId hardcoded to indicate it is from a auto test user and not a real user
    const { statusCode, headers, json } = await this.put(
      `/user/75cec841-8414-42f2-aff2-7e9750a5bd4c/organisation/${organisationId}`,
      JSON.stringify(payload),
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
  async getOrganisationDetails(
    organisationId,
    userId = '75cec841-8414-42f2-aff2-7e9750a5bd4c'
  ) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
    }

    // leaving the userId hardcoded to indicate it is from a auto test user and not a real user
    const { statusCode, headers, json } = await this.get(
      `/user/${userId}/organisation/${organisationId}`,
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
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
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
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
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

  /**
   * @param {{ startDate?: string, endDate?: string }} params
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async getOrganisationsByDateRange({ startDate, endDate } = {}) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json',
      'Accept-Encoding': 'identity'
    }
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
    }

    const params = new URLSearchParams()
    if (startDate !== undefined) params.set('startDate', startDate)
    if (endDate !== undefined) params.set('endDate', endDate)
    const query = params.toString()
    const endpoint = query ? `/organisations?${query}` : '/organisations'

    const { statusCode, headers, json } = await this.get(
      endpoint,
      requestHeaders
    )

    return {
      statusCode,
      headers,
      json
    }
  }

  async getBulkUploadIdByFileName(organisationId, fileName) {
    const requestHeaders = {
      Authorization: `Basic ${this.base64Credentials}`,
      'Content-Type': 'application/json'
    }
    // this will ever be added only when running test from local machine
    if (this.testEnv.xApiKey) {
      requestHeaders['x-api-key'] = this.testEnv.xApiKey
    }

    const { statusCode, headers, json } = await this.get(
      `/test/spreadsheet/${organisationId}/uploads?filename=${fileName}`,
      requestHeaders
    )

    return {
      statusCode,
      headers,
      json
    }
  }
}
