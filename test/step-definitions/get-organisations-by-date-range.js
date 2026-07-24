import { When, Then } from '@wdio/cucumber-framework'
import {
  ACTIVE_API_CODE_ORGANISATIONS,
  DATE_RANGE_FIXTURES,
  VALIDATION_ERROR_FIXTURES,
  assertActiveApiCodeCounts,
  assertBadRequestResponse,
  assertOrganisationsMatch,
  assertOrganisationsOrderedByOrganisationId,
  assertOrganisationsOrderedByDateRegisteredDesc
} from '../data/expected-organisations-by-date-range.js'

async function callGetOrganisationsByDateRange(context, params) {
  context.response =
    await context.apis.wasteOrganisationBackendAPI.getOrganisationsByDateRange(
      params
    )
}

When(
  'the get-organisations-by-date-range endpoint is called for {string} date range',
  async function (fixtureKey) {
    const fixture = DATE_RANGE_FIXTURES[fixtureKey]
    if (!fixture) {
      throw new Error(`Unknown date range fixture: ${fixtureKey}`)
    }
    this.expectedOrganisations = fixture.expectedOrganisations
    await callGetOrganisationsByDateRange(this, {
      startDate: fixture.startDate,
      endDate: fixture.endDate
    })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called with startDate {string} and endDate {string}',
  async function (startDate, endDate) {
    await callGetOrganisationsByDateRange(this, { startDate, endDate })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called with only endDate {string}',
  async function (endDate) {
    await callGetOrganisationsByDateRange(this, { endDate })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called with only startDate {string}',
  async function (startDate) {
    await callGetOrganisationsByDateRange(this, { startDate })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called for {string} validation error',
  async function (fixtureKey) {
    const fixture = VALIDATION_ERROR_FIXTURES[fixtureKey]
    if (!fixture) {
      throw new Error(`Unknown validation error fixture: ${fixtureKey}`)
    }
    this.expectedError = fixture.expectedError
    const { expectedError, ...params } = fixture
    await callGetOrganisationsByDateRange(this, params)
  }
)

Then(
  'a successful response with matching organisations should be returned',
  async function () {
    expect(this.response.statusCode).toBe(200)
    assertOrganisationsMatch(this.response.json, this.expectedOrganisations)
  }
)

Then('an empty organisations list should be returned', async function () {
  expect(this.response.statusCode).toBe(200)
  expect(this.response.json).toEqual([])
})

Then(
  'only active API codes should be reflected in activeApiCodeCount',
  async function () {
    assertActiveApiCodeCounts(this.response.json, ACTIVE_API_CODE_ORGANISATIONS)
  }
)

Then(
  'organisations should be sorted by dateRegistered descending',
  async function () {
    assertOrganisationsOrderedByDateRegisteredDesc(this.response.json)
  }
)

Then(
  'organisations with the same dateRegistered should be ordered by organisationId descending',
  async function () {
    assertOrganisationsOrderedByOrganisationId(
      this.response.json,
      this.expectedOrganisations
    )
  }
)

Then('a bad request validation error should be returned', async function () {
  assertBadRequestResponse(this.response, this.expectedError)
})
