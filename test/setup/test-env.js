/**
 * Environment variables. Getters read process.env when called.
 */
export class TestEnv {
  /** @returns {string|undefined} */
  get environment() {
    return process.env.ENVIRONMENT
  }

  /** @returns {string|undefined} */
  get httpProxy() {
    return process.env.HTTP_PROXY
  }

  /** @returns {string|undefined} */
  get zapApiKey() {
    return process.env.ZAP_API_KEY
  }

  /** @returns {string|undefined} */
  get govPayApiKey() {
    return process.env.GOV_PAY_API_KEY
  }

  /** @returns {string|undefined} */
  get xApiKey() {
    return process.env.xapikey
  }

  /** @returns {string|undefined} */
  get cognitoClientId() {
    return process.env.COGNITO_CLIENT_ID
  }

  /** @returns {string|undefined} */
  get cognitoClientSecret() {
    return process.env.COGNITO_CLIENT_SECRET
  }

  /** @returns {string|undefined} */
  get organisationBackendPassword() {
    return process.env.ORGANISATION_BACKEND_PASSWORD
  }

  /** @returns {string|undefined} */
  get wasteMovementBackendPassword() {
    return process.env.WASTE_MOVEMENT_BACKEND_PASSWORD
  }

  /** @returns {string|undefined} */
  get defraGovUkPassword() {
    return process.env.defraGovUKPassword
  }

  /** @returns {string|undefined} */
  get defraGovGatewayPassword() {
    return process.env.defraGovGatewayPassword
  }

  /** @returns {string|undefined} */
  get adminUiPassword() {
    return process.env.adminUiPassword
  }

  /** @returns {string|undefined} */
  get adminUiBaseUrl() {
    return process.env.ADMIN_UI_BASE_URL
  }

  /** @returns {string|undefined} */
  get wasteMovementClientSyncServiceUrl() {
    return process.env.DWT_CLIENT_SYNC_SERVICE_URL
  }

  /** @returns {string|undefined} */
  get serviceAuthPassword() {
    return process.env.SERVICE_AUTH_PASSWORD
  }

  /** @returns {string|undefined} */
  get cdpDevApiKey() {
    return process.env.CDP_DEV_API_KEY
  }

  /** @returns {string|undefined} */
  get basicAuthUsername() {
    return process.env.BASIC_AUTH_USERNAME
  }

  /** @returns {string|undefined} */
  get basicAuthPassword() {
    return process.env.BASIC_AUTH_PASSWORD
  }

  /** @returns {string|undefined} */
  get govPayServiceFreePeriodEnd() {
    return process.env.GOVPAY_SERVICE_FREE_PERIOD_END
  }

  /** @returns {string|undefined} */
  get govPayWebhookSigningSecret() {
    return process.env.GOVPAY_WEBHOOK_SIGNING_SECRET
  }

  /** @returns {string} */
  get cucumberExtraTags() {
    return process.env.CUCUMBER_EXTRA_TAGS?.trim() ?? ''
  }

  /** @returns {string|undefined} */
  get debug() {
    return process.env.DEBUG
  }

  /** @returns {string|undefined} */
  get browserstackUsername() {
    return process.env.BROWSERSTACK_USERNAME
  }

  /** @returns {string|undefined} */
  get browserstackKey() {
    return process.env.BROWSERSTACK_KEY
  }

  /** @returns {string} */
  get chromedriverHost() {
    return process.env.CHROMEDRIVER_URL || '127.0.0.1'
  }

  /** @returns {string|number} */
  get chromedriverPort() {
    return process.env.CHROMEDRIVER_PORT || 4444
  }

  /**
   * Remote Chrome host. `GRID_HOST`, then `CHROMEDRIVER_URL`, then `127.0.0.1`.
   * @returns {string}
   */
  get gridHost() {
    return process.env.GRID_HOST || this.chromedriverHost
  }

  /**
   * Remote Chrome port. `GRID_PORT`, then `CHROMEDRIVER_PORT`, then 4444.
   * @returns {number}
   */
  get gridPort() {
    return Number(process.env.GRID_PORT || this.chromedriverPort) || 4444
  }

  /**
   * Parallel workers. Unset means 1.
   * @returns {number}
   */
  get maxInstances() {
    return Number(process.env.MAX_INSTANCES) || 1
  }

  /**
   * Unset means cdp when HTTP_PROXY is set, otherwise off.
   * @returns {'off'|'cdp'|'zap'}
   */
  get proxyMode() {
    const value = process.env.PROXY_MODE || (this.httpProxy ? 'cdp' : 'off')
    if (value === 'off' || value === 'cdp' || value === 'zap') return value
    throw new Error(`Invalid PROXY_MODE "${value}"`)
  }
}
