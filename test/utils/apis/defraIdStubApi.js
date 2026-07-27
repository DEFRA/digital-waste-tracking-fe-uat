import { BaseAPI } from './base-api.js'
import { v4 as uuidv4 } from 'uuid'
import allure from '@wdio/allure-reporter'

export class DefraIdStubAPI extends BaseAPI {
  /**
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async registerNewUser(email, relationshipDetails = {}) {
    allure.addArgument('Test User Email', email)
    const relationship =
      typeof relationshipDetails === 'string'
        ? { organisationId: relationshipDetails }
        : relationshipDetails
    const userData = {
      userId: uuidv4(),
      email,
      firstName: 'PTest',
      lastName: 'DWT',
      loa: '1',
      aal: '1',
      enrolmentCount: 1,
      enrolmentRequestCount: 1,
      relationships: [
        {
          organisationName:
            relationship.organisationName ?? 'Some Receiver Org',
          organisationId: relationship.organisationId,
          relationshipId: relationship.relationshipId,
          relationshipRole: 'Employee',
          roleName: 'Some Receiver role',
          roleStatus: '1'
        }
      ]
    }
    const { statusCode, headers, json } = await this.post(
      '/API/register',
      JSON.stringify(userData),
      { 'Content-Type': 'application/json' }
    )

    return {
      statusCode,
      headers,
      json
    }
  }

  async expireUser(userId) {
    const { statusCode, headers, json } = await this.post(
      `/API/register/${userId}/expire`,
      JSON.stringify({}),
      { 'Content-Type': 'application/json' }
    )
    return {
      statusCode,
      headers,
      json
    }
  }
}
