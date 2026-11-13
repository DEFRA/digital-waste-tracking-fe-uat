/**
 * Values one scenario passes between steps.
 * Hooks and steps assign these on the scenario's testMemory.
 */
export class TestMemory {
  /** @type {string|null} */
  pageName = null

  /** @type {string} */
  tags = ''

  /** @type {import('@axe-core/webdriverio').AxeBuilder|null} */
  axeBuilder = null

  /** @type {import('../utils/apis/api-factory.js').ApiInstances} */
  apis

  /** @type {string} */
  browserInfo = ''

  /** @type {string} */
  deviceInfo = ''

  /** @type {string|undefined} */
  browserstackSessionId

  /** @type {string|undefined} */
  govUKUser

  /** @type {string|undefined} */
  govGatewayUser

  /** @type {string|undefined} */
  multipleBusinessesGovUKUser

  /** @type {boolean|undefined} */
  userWithMultipleBusinesses

  /** @type {boolean|undefined} */
  doNotAddUserToPool

  /** @type {boolean|undefined} */
  isLocalAuthority

  /** @type {string|undefined} */
  userEmail

  /** @type {string|undefined} */
  originalUserEmail

  /** @type {string|undefined} */
  defraIdMockUser

  /** @type {string|undefined} */
  defraIdMockUserId

  /** @type {string|undefined} */
  differentDefraIdMockUserId

  /** @type {string|undefined} */
  selectedOrganisation

  /** @type {string|undefined} */
  organisationId

  /** @type {string|undefined} */
  organisationName

  /** @type {string|null|undefined} */
  disableAfter

  /** @type {string|undefined} */
  organisationDisableAfter

  /** @type {string|undefined} */
  activeApiCode

  /** @type {string[]|undefined} */
  activeAPICodes

  /** @type {string|undefined} */
  disabledApiCode

  /** @type {string|undefined} */
  newApiCodeName

  /** @type {string|undefined} */
  apiCode

  /** @type {string|undefined} */
  defraOrganisationId

  /** @type {import('../utils/apis/base-api.js').JsonResponse|undefined} */
  response

  /** @type {Object|undefined} */
  expectedError

  /** @type {string|undefined} */
  uniquePaymentReference

  /** @type {string|undefined} */
  paymentId

  /** @type {string|undefined} */
  paymentReference

  /** @type {string|undefined} */
  paymentOrganisationId

  /** @type {string|undefined} */
  paymentServicePeriodStart

  /** @type {string|undefined} */
  paymentServicePeriodEnd

  /** @type {string|undefined} */
  refundId

  /** @type {number|undefined} */
  expectedRefundAmountAvailable

  /** @type {string|undefined} */
  nextPaymentDueDate

  /** @type {string|undefined} */
  serviceChargeDueDate

  /** @type {string|undefined} */
  spreadsheetFileName

  /** @type {string|undefined} */
  uploadedFileName

  /** @type {string|undefined} */
  uploadId

  /** @type {string|undefined} */
  referenceNumber

  /** @type {string|undefined} */
  dateRangeFixtureKey

  /** @type {string|undefined} */
  frontendValidationFixtureKey

  /** @type {string|undefined} */
  enteredPassword

  /** @type {string|undefined} */
  loginValidationFixtureKey

  /** @type {Array<{ value: string, row: number }>|undefined} */
  wtids

  /** @type {{ fileName: string, content?: string }|undefined} */
  downloadedCsv

  /** @type {Array<{ organisationId: string, dateRegistered: string, activeApiCodeCount: number }>|undefined} */
  expectedOrganisations

  /** @type {{ status?: string, amount_available?: number }|undefined} */
  refundSummary

  /** @type {import('../utils/apis/base-api.js').JsonResponse|undefined} */
  refundResponse

  /** @type {import('../utils/apis/base-api.js').JsonResponse|undefined} */
  refundWebhookResponse

  /** @type {Array<{ from?: string }>|undefined} */
  nextPaymentPeriod

  /** @type {{ state?: { status?: string }, reference?: string, payment_id?: string, metadata?: { organisationId?: string, servicePeriodStart?: string, servicePeriodEnd?: string }, refund_summary?: { status?: string, amount_available?: number } }|undefined} */
  paymentStatus

  /** @type {import('../page-objects/page.js').Page|undefined} */
  currentPage

  /** @type {import('../utils/apis/base-api.js').JsonResponse|undefined} */
  clientsResponse

  /** @type {Array<{ clientName?: string, clientId?: string }>|undefined} */
  expectedClients

  /** @type {string|undefined} */
  enteredClientName

  /** @type {string|undefined} */
  expectedClientNameError

  /** @type {string|undefined} */
  createdClientName

  /** @type {string|undefined} */
  createdClientId

  /** @type {string|undefined} */
  credentialsUrl
}
