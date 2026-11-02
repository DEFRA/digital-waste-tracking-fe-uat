import { WasteOrganisationBackendAPI } from './wasteOrganisationBackendApi.js'
import { WasteMovementBackendAPI } from './wasteMovementBackendApi.js'
import { WasteMovementExternalAPI } from './wasteMovementApi.js'
import { CognitoOAuthApi } from './cognitoOAuth.js'
import { DefraIdStubAPI } from './defraIdStubApi.js'
import { GovPayAPI } from './govpayApi.js'
import { WasteOrganisationFrontendAPI } from './wasteOrganisationFrontendApi.js'
import { ZapApi } from './zap-api.js'

/**
 * @typedef {Object} ApiInstances
 * @property {WasteOrganisationBackendAPI} wasteOrganisationBackendAPI
 * @property {WasteMovementBackendAPI} wasteMovementBackendAPI
 * @property {WasteMovementExternalAPI} wasteMovementExternalAPI
 * @property {CognitoOAuthApi} cognitoOAuthApi
 * @property {DefraIdStubAPI} defraIdStubAPI
 * @property {GovPayAPI} govPayAPI
 * @property {WasteOrganisationFrontendAPI} wasteOrganisationFrontendAPI
 * @property {ZapApi} [zapAPI]
 * @property {() => Promise<void>} close
 */
export class ApiFactory {
  /**
   * Builds API clients for one scenario.
   * cdp proxies Cognito and GOV.UK Pay. zap proxies every service client.
   * The ZAP client itself is not sent back through the proxy.
   * @param {import('../../setup/test-env.js').TestEnv} testEnv
   * @param {import('../../setup/test-config.js').TestConfig} testConfig
   * @returns {ApiInstances}
   */
  static create(testEnv, testConfig) {
    const environment = testEnv.environment
    const mode = testEnv.proxyMode
    const httpProxy = testEnv.httpProxy
    const internalProxy = mode === 'zap' ? httpProxy : undefined
    const externalProxy = mode === 'off' ? undefined : httpProxy

    const wasteOrganisationBackendServiceUrl = testEnv.xApiKey
      ? `https://ephemeral-protected.api.${environment}.cdp-int.defra.cloud/waste-organisation-backend`
      : testConfig.wasteOrganisationBackendServiceUrl

    const wasteMovementBackendServiceUrl = testEnv.xApiKey
      ? `https://ephemeral-protected.api.${environment}.cdp-int.defra.cloud/waste-movement-backend`
      : testConfig.wasteMovementBackendServiceUrl

    /** @type {Omit<ApiInstances, 'close'>} */
    const clients = {
      wasteMovementBackendAPI: new WasteMovementBackendAPI(
        wasteMovementBackendServiceUrl,
        internalProxy,
        testEnv
      ),
      wasteOrganisationBackendAPI: new WasteOrganisationBackendAPI(
        wasteOrganisationBackendServiceUrl,
        internalProxy,
        testEnv
      ),
      wasteMovementExternalAPI: new WasteMovementExternalAPI(
        testConfig.wasteMovementExternalApiBaseUrl,
        internalProxy
      ),
      cognitoOAuthApi: new CognitoOAuthApi(
        testConfig.cognitoOAuthBaseUrl,
        externalProxy
      ),
      defraIdStubAPI: new DefraIdStubAPI(
        testConfig.defraIdServiceUrl,
        internalProxy
      ),
      govPayAPI: new GovPayAPI(testConfig.govPayBaseUrl, externalProxy),
      wasteOrganisationFrontendAPI: new WasteOrganisationFrontendAPI(
        testConfig.wasteOrganisationFrontendBaseUrl,
        internalProxy
      )
    }

    if (mode === 'zap') {
      clients.zapAPI = new ZapApi(httpProxy, null, testEnv.zapApiKey)
    }

    return {
      ...clients,
      close: async () => {
        await Promise.all(
          Object.values(clients)
            .filter((api) => api?.close)
            .map((api) => api.close())
        )
      }
    }
  }
}
