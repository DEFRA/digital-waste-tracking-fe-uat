import { readFileSync } from 'node:fs'
import logger from '@wdio/logger'

const log = logger('test-config')

/**
 * One support file. Getters read the file passed to the constructor.
 */
export class TestConfig {
  /** @type {string} */
  #prefix

  #support

  /**
   * Loads `test/support/<prefix>.config.json`.
   * @param {string} prefix - File name without `.config.json`
   */
  constructor(prefix) {
    this.#prefix = prefix
    const file = `./test/support/${prefix}.config.json`
    this.#support = JSON.parse(readFileSync(file, 'utf8'))
  }

  /** @returns {string} */
  get adminUiBaseUrl() {
    return this.#string('adminUiBaseUrl')
  }

  /** @returns {string} */
  get adminUiUsername() {
    return this.#string('adminUiUsername')
  }

  /** @returns {string} */
  get cognitoOAuthBaseUrl() {
    return this.#string('cognitoOAuthBaseUrl')
  }

  /** @returns {string} */
  get defaultGovUKLogin() {
    return this.#string('defaultGovUKLogin')
  }

  /** @returns {string} */
  get defraIdServiceUrl() {
    return this.#string('defraIdServiceUrl')
  }

  /** @returns {string[]} */
  get govGatewayLogin() {
    return this.#list('govGatewayLogin')
  }

  /** @returns {string} */
  get govPayBaseUrl() {
    return this.#string('govPayBaseUrl')
  }

  /** @returns {string} */
  get govUKBaseUrl() {
    return this.#string('govUKBaseUrl')
  }

  /** @returns {string[]} */
  get govUKLogin() {
    return this.#list('govUKLogin')
  }

  /** @returns {string} */
  get govtGatewayLoginUrl() {
    return this.#string('govtGatewayLoginUrl')
  }

  /** @returns {string} */
  get individualUserDefraAccLogin() {
    return this.#string('individualUserDefraAccLogin')
  }

  /** @returns {string[]} */
  get multipleBusinessesGovUKLogin() {
    return this.#list('multipleBusinessesGovUKLogin')
  }

  /** @returns {string} */
  get wasteMovementBackendServiceUrl() {
    return this.#string('wasteMovementBackendServiceUrl')
  }

  /** @returns {string} */
  get wasteMovementExternalApiBaseUrl() {
    return this.#string('wasteMovementExternalApiBaseUrl')
  }

  /** @returns {string} */
  get wasteOrganisationBackendServiceUrl() {
    return this.#string('wasteOrganisationBackendServiceUrl')
  }

  /** @returns {string} */
  get wasteOrganisationFrontendBaseUrl() {
    return this.#string('wasteOrganisationFrontendBaseUrl')
  }

  /** @returns {string[]} */
  get zapProxyExcludeRegexes() {
    return this.#list('zapProxyExcludeRegexes')
  }

  /**
   * @param {string} key
   * @returns {never}
   */
  #missing(key) {
    const message = `Missing "${key}" in test/support/${this.#prefix}.config.json`
    log.error(message)
    throw new Error(message)
  }

  /**
   * @param {string} key
   * @returns {string}
   */
  #string(key) {
    const value = this.#support[key]
    if (typeof value !== 'string') return this.#missing(key)
    return value
  }

  /**
   * @param {string} key
   * @returns {string[]}
   */
  #list(key) {
    const value = this.#support[key]
    if (!Array.isArray(value)) return this.#missing(key)
    return value
  }
}
