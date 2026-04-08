import allure, { addLink } from '@wdio/allure-reporter'

/**
 * Log API request details to Allure report
 * @param {string} method - HTTP method (GET, POST, PUT, etc.)
 * @param {string} endpoint - API endpoint path
 * @param {string} url - Full request URL
 * @param {Object} headers - Request headers
 * @param {boolean} usingProxy - Whether the request is using a proxy
 * @param {string|Object} [data] - Request body data
 */
export async function logAllureRequest(
  method,
  endpoint,
  url,
  headers,
  httpProxy,
  data = null
) {
  allure.startStep(`${method} Request to ${endpoint}`)

  try {
    // Attach request details to Allure report
    allure.addAttachment('Request URL', url, 'text/plain')
    allure.addAttachment(
      'Request Headers',
      JSON.stringify(headers, null, 2),
      'application/json'
    )
    if (httpProxy) {
      allure.addAttachment('Using Proxy URL', httpProxy, 'text/plain')
    }
    if (data) {
      try {
        // Try to parse as JSON for better formatting
        const jsonData = typeof data === 'string' ? JSON.parse(data) : data
        allure.addAttachment(
          'Request Body',
          JSON.stringify(jsonData, null, 2),
          'application/json'
        )
      } catch {
        // If not JSON, attach as plain text
        allure.addAttachment('Request Body', data, 'text/plain')
      }
    }
  } finally {
    allure.endStep()
  }
}

/**
 * Log API response details to Allure report
 * @param {string} method - HTTP method (GET, POST, PUT, etc.)
 * @param {string} endpoint - API endpoint path
 * @param {number} statusCode - Response status code
 * @param {Object} headers - Response headers
 * @param {Object} body - Response body
 */
export async function logAllureResponse(
  method,
  endpoint,
  statusCode,
  headers,
  body = null
) {
  allure.startStep(`${method} Response from ${endpoint}`)

  try {
    allure.addAttachment('Response Status', `${statusCode}`, 'text/plain')
    allure.addAttachment(
      'Response Headers',
      JSON.stringify(headers, null, 2),
      'application/json'
    )
    allure.addAttachment(
      'Response Info',
      `Response received with content-type: ${headers['content-type'] || 'unknown'}`,
      'text/plain'
    )
    if (body) {
      allure.addAttachment(
        'Response Body',
        JSON.stringify(body, null, 2),
        'application/json'
      )
    }
  } finally {
    allure.endStep()
  }
}

/**
 * TEMPORARY workaround: @wdio/allure-reporter maps Cucumber `@issue=KEY` to `label("issue", KEY)`
 * only; Allure shows Issues from **links** (`type: "issue"`). Remove this when the reporter uses
 * `issueLinkTemplate` for Cucumber @issue tags (see webdriverio/webdriverio wdio-allure-reporter).
 */

/** Keep in sync with `reporters[allure].issueLinkTemplate` (must contain `{}` for the issue id). */
export const ALLURE_ISSUE_LINK_TEMPLATE =
  'https://eaflood.atlassian.net/browse/{}'

/**
 * @param {{ tags?: { name: string }[] }} pickle
 * @param {string} [issueLinkTemplate]
 */
export async function addAllureIssueLinksFromPickleTags(
  pickle,
  issueLinkTemplate = ALLURE_ISSUE_LINK_TEMPLATE
) {
  if (!pickle?.tags?.length || !issueLinkTemplate.includes('{}')) return
  for (const tag of pickle.tags) {
    const m = String(tag.name).match(/^@?issue=(.+)$/i)
    if (!m) continue
    const issueId = m[1].trim()
    if (!issueId) continue
    const url = issueLinkTemplate.split('{}').join(issueId)
    await addLink(url, issueId, 'issue')
  }
}
