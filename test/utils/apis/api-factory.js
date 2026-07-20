import { WasteOrganisationBackendAPI } from './wasteOrganisationBackendApi.js'
import { WasteMovementBackendAPI } from './wasteMovementBackendApi.js'
import { WasteMovementExternalAPI } from './wasteMovementApi.js'
import { CognitoOAuthApi } from './cognitoOAuth.js'
import { DefraIdStubAPI } from './defraIdStubApi.js'
import { GovPayAPI } from './govpayApi.js'
import { WasteOrganisationFrontendAPI } from './wasteOrganisationFrontendApi.js'

/**
 * @typedef {Object} ApiInstances
 * @property {WasteOrganisationBackendAPI} wasteOrganisationBackendAPI
 * @property {WasteMovementExternalAPI} wasteMovementExternalAPI
 * @property {CognitoOAuthApi} cognitoOAuthApi
 * @property {WasteOrganisationFrontendAPI} wasteOrganisationFrontendAPI
 */
export class ApiFactory {
  static create(
    baseUrl,
    movementBackendBaseUrl,
    externalApiBaseUrl,
    authBaseUrl,
    defraIdStubBaseUrl,
    govPayBaseUrl,
    frontendBaseUrl,
    httpProxy
  ) {
    return {
      wasteMovementBackendAPI: new WasteMovementBackendAPI(
        movementBackendBaseUrl,
        httpProxy
      ),
      wasteOrganisationBackendAPI: new WasteOrganisationBackendAPI(
        baseUrl,
        httpProxy
      ),
      wasteMovementExternalAPI: new WasteMovementExternalAPI(
        externalApiBaseUrl,
        httpProxy
      ),
      cognitoOAuthApi: new CognitoOAuthApi(authBaseUrl, httpProxy),
      defraIdStubAPI: new DefraIdStubAPI(defraIdStubBaseUrl, httpProxy),
      govPayAPI: new GovPayAPI(govPayBaseUrl, httpProxy),
      wasteOrganisationFrontendAPI: new WasteOrganisationFrontendAPI(
        frontendBaseUrl,
        httpProxy
      )
    }
  }
}
