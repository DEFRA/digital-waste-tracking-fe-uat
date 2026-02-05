import allure from '@wdio/allure-reporter'

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
