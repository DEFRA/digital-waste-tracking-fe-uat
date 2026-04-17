import { BaseAPI } from './base-api.js'
import { v4 as uuidv4 } from 'uuid'

export class DefraIdStubAPI extends BaseAPI {
  /**
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async registerNewUser(email) {
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
          organisationName: 'Some Receiver Org',
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
}
