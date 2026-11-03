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
  context.testMemory.response =
    await context.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationsByDateRange(
      params
    )
}

When(
  'the get-organisations-by-date-range endpoint is called for {string} date range',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = DATE_RANGE_FIXTURES[fixtureKey]
    if (!fixture) {
      throw new Error(`Unknown date range fixture: ${fixtureKey}`)
    }
    this.testMemory.expectedOrganisations = fixture.expectedOrganisations
    await callGetOrganisationsByDateRange(this, {
      startDate: fixture.startDate,
      endDate: fixture.endDate
    })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called with startDate {string} and endDate {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    startDate,
    endDate
  ) {
    await callGetOrganisationsByDateRange(this, { startDate, endDate })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called with only endDate {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    endDate
  ) {
    await callGetOrganisationsByDateRange(this, { endDate })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called with only startDate {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    startDate
  ) {
    await callGetOrganisationsByDateRange(this, { startDate })
  }
)

When(
  'the get-organisations-by-date-range endpoint is called for {string} validation error',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = VALIDATION_ERROR_FIXTURES[fixtureKey]
    if (!fixture) {
      throw new Error(`Unknown validation error fixture: ${fixtureKey}`)
    }
    this.testMemory.expectedError = fixture.expectedError
    const { expectedError, ...params } = fixture
    await callGetOrganisationsByDateRange(this, params)
  }
)

Then(
  'a successful response with matching organisations should be returned',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    expect(this.testMemory.response.statusCode).toBe(200)
    assertOrganisationsMatch(
      this.testMemory.response.json,
      this.testMemory.expectedOrganisations
    )
  }
)

Then(
  'an empty organisations list should be returned',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    expect(this.testMemory.response.statusCode).toBe(200)
    expect(this.testMemory.response.json).toEqual([])
  }
)

Then(
  'only active API codes should be reflected in activeApiCodeCount',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    assertActiveApiCodeCounts(
      this.testMemory.response.json,
      ACTIVE_API_CODE_ORGANISATIONS
    )
  }
)

Then(
  'organisations should be sorted by dateRegistered descending',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    assertOrganisationsOrderedByDateRegisteredDesc(
      this.testMemory.response.json
    )
  }
)

Then(
  'organisations with the same dateRegistered should be ordered by organisationId descending',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    assertOrganisationsOrderedByOrganisationId(
      this.testMemory.response.json,
      this.testMemory.expectedOrganisations
    )
  }
)

Then(
  'a bad request validation error should be returned',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    assertBadRequestResponse(
      this.testMemory.response,
      this.testMemory.expectedError
    )
  }
)
