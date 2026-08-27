import { BaseAPI } from './base-api.js'

/**
 * Client for the ZAP REST API (same host/port as HTTP_PROXY).
 */
export class ZapApi extends BaseAPI {
  constructor(baseUrl, httpProxy, apiKey) {
    super(baseUrl, httpProxy)
    this.apiKey = apiKey
  }

  /**
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async newSession() {
    return this.get(
      this.#endpoint('/JSON/core/action/newSession/', {
        name: 'digital-waste-tracking-uat',
        overwrite: 'true'
      })
    )
  }

  /**
   * @returns {Promise<import('./base-api.js').TextResponse>}
   */
  async htmlReport() {
    return this.getText(this.#endpoint('/OTHER/core/other/htmlreport/'))
  }

  /**
   * @returns {Promise<import('./base-api.js').TextResponse>}
   */
  async jsonReport() {
    return this.getText(this.#endpoint('/OTHER/core/other/jsonreport/'))
  }

  /**
   * Gets number of alerts grouped by each risk level.
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async alertsSummary() {
    return this.get(this.#endpoint('/JSON/alert/view/alertsSummary/'))
  }

  /**
   * Disable a passive scan rule (omit from scan; alertThreshold OFF).
   * @param {string} scannerId - Passive scan rule id (plugin id)
   * @param {'OFF'|'DEFAULT'|'LOW'|'MEDIUM'|'HIGH'} [alertThreshold='OFF']
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async setPassiveScannerAlertThreshold(scannerId, alertThreshold = 'OFF') {
    return this.get(
      this.#endpoint('/JSON/pscan/action/setScannerAlertThreshold/', {
        id: scannerId,
        alertThreshold
      })
    )
  }

  /**
   * Exclude URLs matching the regex from the proxy (not stored in Sites/History, not scanned).
   * Regex syntax is Java regex as used by ZAP.
   * Note: ZAP 2.17 does not expose pscan/action/excludeFromScan — use this instead.
   * @param {string} regex
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async excludeFromProxy(regex) {
    return this.get(
      this.#endpoint('/JSON/core/action/excludeFromProxy/', { regex })
    )
  }

  /**
   * @returns {Promise<import('./base-api.js').JsonResponse>}
   */
  async getExcludedFromProxy() {
    return this.get(this.#endpoint('/JSON/core/view/excludedFromProxy/'))
  }

  /**
   * Apply multiple proxy URL exclude regexes (Global Exclude URL).
   * @param {string[]} regexes
   * @returns {Promise<string[]>} the excludes registered in ZAP after applying
   */
  async excludeUrlsFromProxy(regexes = []) {
    for (const regex of regexes) {
      const response = await this.excludeFromProxy(regex)
      if (response.statusCode !== 200 || response.json?.Result !== 'OK') {
        throw new Error(
          `ZAP excludeFromProxy failed for regex "${regex}": status=${response.statusCode} body=${JSON.stringify(response.json)}`
        )
      }
    }

    const listed = await this.getExcludedFromProxy()
    return listed.json?.excludedFromProxy ?? []
  }

  /**
   * @param {string} path - API path
   * @param {Record<string, string>} [queryParams={}]
   * @returns {string}
   */
  #endpoint(path, queryParams = {}) {
    const search = new URLSearchParams({ apikey: this.apiKey })

    for (const [key, value] of Object.entries(queryParams)) {
      search.set(key, value)
    }

    return `${path}?${search}`
  }
}
