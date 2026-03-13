import { Then } from '@wdio/cucumber-framework'
import { generateBaseWasteReceiptData } from '../utils/apis/test-data-manager.js'
import { authenticateAndSetToken } from '../utils/apis/auth.js'

Then(
  /^user should be able to use the (new |current |)API code to submit waste movements$/,
  async function (apiCodeType) {
    const wasteReceiptData = generateBaseWasteReceiptData()
    wasteReceiptData.apiCode = this.activeApiCode
    // Authenticate and set the auth token
    const authResponse = await authenticateAndSetToken(
      this.apis.cognitoOAuthApi,
      this.env.COGNITO_CLIENT_ID,
      this.env.COGNITO_CLIENT_SECRET
    )
    this.apis.wasteMovementExternalAPI.setAuthToken(
      authResponse.json.access_token
    )
    const response =
      await this.apis.wasteMovementExternalAPI.receiveMovement(wasteReceiptData)
    expect(response.statusCode).toBe(201)
    expect(response.json.wasteTrackingId).toBeDefined()
  }
)

Then(
  'user should not be able to submit movements using disabled API Code',
  async function () {
    const wasteReceiptData = generateBaseWasteReceiptData()
    wasteReceiptData.apiCode = this.disabledApiCode
    // Authenticate and set the auth token
    const authResponse = await authenticateAndSetToken(
      this.apis.cognitoOAuthApi,
      this.env.COGNITO_CLIENT_ID,
      this.env.COGNITO_CLIENT_SECRET
    )
    this.apis.wasteMovementExternalAPI.setAuthToken(
      authResponse.json.access_token
    )
    const response =
      await this.apis.wasteMovementExternalAPI.receiveMovement(wasteReceiptData)
    expect(response.statusCode).toBe(400)
    expect(response.json).toEqual({
      validation: {
        errors: [
          {
            key: 'apiCode',
            errorType: 'InvalidValue',
            message: 'the API Code supplied is invalid'
          }
        ]
      }
    })
  }
)
