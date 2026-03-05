import { WasteOrganisationBackendAPI } from './wasteOrganisationBackendApi.js'
import { WasteMovementExternalAPI } from './wasteMovementApi.js'
import { CognitoOAuthApi } from './cognitoOAuth.js'

/**
 * @typedef {Object} ApiInstances
 * @property {WasteOrganisationBackendAPI} wasteOrganisationBackendAPI - Waste Organisation Backend API instance
 * @property {WasteMovementExternalAPI} wasteMovementExternalAPI - Waste Movement External API instance
 * @property {CognitoOAuthApi} cognitoOAuthApi - Cognito OAuth API instance
 */
export class ApiFactory {
  static create(baseUrl, externalApiBaseUrl, authBaseUrl, httpProxy) {
    return {
      wasteOrganisationBackendAPI: new WasteOrganisationBackendAPI(
        baseUrl,
        httpProxy
      ),
      wasteMovementExternalAPI: new WasteMovementExternalAPI(
        externalApiBaseUrl,
        httpProxy
      ),
      cognitoOAuthApi: new CognitoOAuthApi(authBaseUrl, httpProxy)
    }
  }
}
