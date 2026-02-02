import { WasteOrganisationBackendAPI } from './wasteOrganisationBackendApi.js'

/**
 * @typedef {Object} ApiInstances
 * @property {WasteOrganisationBackendAPI} wasteOrganisationBackendAPI - Waste Organisation Backend API instance
 */
export class ApiFactory {
  static create(baseUrl, httpProxy) {
    return {
      wasteOrganisationBackendAPI: new WasteOrganisationBackendAPI(
        baseUrl,
        httpProxy
      )
    }
  }
}
