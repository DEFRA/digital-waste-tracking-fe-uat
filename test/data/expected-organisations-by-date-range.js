const organisation = (organisationId, dateRegistered, activeApiCodeCount) => ({
  organisationId,
  dateRegistered,
  activeApiCodeCount
})

export const DATE_RANGE_FIXTURES = {
  full_range: {
    startDate: '2024-01-01',
    endDate: '2024-12-31',
    expectedOrganisations: [
      organisation(
        'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b13',
        '2024-12-22T23:45:00.000Z',
        0
      ),
      organisation(
        'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a12',
        '2024-12-22T19:20:15.000Z',
        0
      ),
      organisation(
        'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f11',
        '2024-12-22T09:30:00.000Z',
        2
      ),
      organisation(
        '28c74af7-d1df-4c22-a4fc-6945d04bdce2',
        '2024-09-15T14:59:59.000Z',
        1
      ),
      organisation(
        'f42bc5d3-2d0c-4b31-ae90-d44a472cf958',
        '2024-03-25T00:00:00.000Z',
        9
      ),
      organisation(
        'b8f90b0c-6156-4f58-8df5-b76e5ebcfd67',
        '2024-03-25T00:00:00.000Z',
        1
      ),
      organisation(
        '74dc6d88-2816-4d39-b983-63d35f4cb9af',
        '2024-03-25T00:00:00.000Z',
        1
      ),
      organisation(
        '0dd9bcf4-1bd2-4c91-8b87-7b76b7a2d90c',
        '2024-03-25T00:00:00.000Z',
        4
      ),
      organisation(
        'c1f1d0cf-5b95-4d0d-b8b3-0bc80b77b78f',
        '2024-03-24T21:15:09.000Z',
        0
      ),
      organisation(
        'c8cbe6cb-9af7-4b80-8b82-538d76ecad43',
        '2024-03-18T08:30:55.000Z',
        1
      ),
      organisation(
        'bfc57d9f-9ef6-4c6d-a34e-0d69b79a4db0',
        '2024-03-10T16:45:12.000Z',
        11
      ),
      organisation(
        'ec12b2d2-f7c6-40e9-a5ef-9bdb1c8d6581',
        '2024-02-11T13:27:41.000Z',
        0
      ),
      organisation(
        '6d35c84d-b4f8-4f8d-84db-39f9894c1a6a',
        '2024-01-18T09:14:26.000Z',
        1
      )
    ]
  },
  single_day: {
    startDate: '2024-12-22',
    endDate: '2024-12-22',
    expectedOrganisations: [
      organisation(
        'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b13',
        '2024-12-22T23:45:00.000Z',
        0
      ),
      organisation(
        'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a12',
        '2024-12-22T19:20:15.000Z',
        0
      ),
      organisation(
        'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f11',
        '2024-12-22T09:30:00.000Z',
        2
      )
    ]
  },
  same_registered_timestamp: {
    startDate: '2024-03-25',
    endDate: '2024-03-25',
    expectedOrganisations: [
      organisation(
        'f42bc5d3-2d0c-4b31-ae90-d44a472cf958',
        '2024-03-25T00:00:00.000Z',
        9
      ),
      organisation(
        'b8f90b0c-6156-4f58-8df5-b76e5ebcfd67',
        '2024-03-25T00:00:00.000Z',
        1
      ),
      organisation(
        '74dc6d88-2816-4d39-b983-63d35f4cb9af',
        '2024-03-25T00:00:00.000Z',
        1
      ),
      organisation(
        '0dd9bcf4-1bd2-4c91-8b87-7b76b7a2d90c',
        '2024-03-25T00:00:00.000Z',
        4
      )
    ]
  },
  narrow_range: {
    startDate: '2024-03-10',
    endDate: '2024-03-19',
    expectedOrganisations: [
      organisation(
        'bfc57d9f-9ef6-4c6d-a34e-0d69b79a4db0',
        '2024-03-10T16:45:12.000Z',
        11
      ),
      organisation(
        'c8cbe6cb-9af7-4b80-8b82-538d76ecad43',
        '2024-03-18T08:30:55.000Z',
        1
      )
    ]
  },
  empty_range: {
    startDate: '2023-01-01',
    endDate: '2023-01-02',
    expectedOrganisations: []
  }
}

export const ACTIVE_API_CODE_ORGANISATIONS = [
  organisation(
    'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f11',
    '2024-12-22T09:30:00.000Z',
    2
  ),
  organisation(
    'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a12',
    '2024-12-22T19:20:15.000Z',
    0
  ),
  organisation(
    'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b13',
    '2024-12-22T23:45:00.000Z',
    0
  ),
  organisation(
    'ec12b2d2-f7c6-40e9-a5ef-9bdb1c8d6581',
    '2024-02-11T13:27:41.000Z',
    0
  ),
  organisation(
    'c1f1d0cf-5b95-4d0d-b8b3-0bc80b77b78f',
    '2024-03-24T21:15:09.000Z',
    0
  ),
  organisation(
    'c8cbe6cb-9af7-4b80-8b82-538d76ecad43',
    '2024-03-18T08:30:55.000Z',
    1
  ),
  organisation(
    'bfc57d9f-9ef6-4c6d-a34e-0d69b79a4db0',
    '2024-03-10T16:45:12.000Z',
    11
  )
]

export const VALIDATION_ERROR_FIXTURES = {
  start_after_end: {
    startDate: '2024-06-01',
    endDate: '2024-01-01',
    expectedError: {
      statusCode: 400,
      error: 'Bad Request',
      message: '"endDate" must be greater than or equal to "ref:startDate"',
      validation: {
        source: 'query',
        keys: ['endDate']
      }
    }
  },
  missing_start_date: {
    endDate: '2024-12-31',
    expectedError: {
      statusCode: 400,
      error: 'Bad Request',
      message:
        '"startDate" is required. "endDate" date references "ref:startDate" which must have a valid date format',
      validation: {
        source: 'query',
        keys: ['startDate', 'endDate']
      }
    }
  },
  missing_end_date: {
    startDate: '2024-01-01',
    expectedError: {
      statusCode: 400,
      error: 'Bad Request',
      message: '"endDate" is required',
      validation: {
        source: 'query',
        keys: ['endDate']
      }
    }
  },
  invalid_date: {
    startDate: '3rd Jan 2023',
    endDate: '2024-12-31',
    expectedError: {
      statusCode: 400,
      error: 'Bad Request',
      message:
        '"startDate" must be in ISO 8601 date format. "endDate" date references "ref:startDate" which must have a valid date format',
      validation: {
        source: 'query',
        keys: ['startDate', 'endDate']
      }
    }
  }
}

export const FRONTEND_VALIDATION_FIXTURES = {
  invalid_from_date: {
    fromDate: {
      day: '01',
      month: '44',
      year: '2024'
    },
    toDate: {
      day: '31',
      month: '7',
      year: '2024'
    },
    expectedErrors: [
      {
        message: 'From date must be a valid date',
        errorField: 'date-from'
      }
    ]
  },
  invalid_to_date: {
    fromDate: {
      day: '01',
      month: '1',
      year: '2024'
    },
    toDate: {
      day: '01',
      month: '44',
      year: '2025'
    },
    expectedErrors: [
      {
        message: 'To date must be a valid date',
        errorField: 'date-to'
      }
    ]
  },
  invalid_to_date_non_numeric: {
    fromDate: {
      day: '01',
      month: '1',
      year: '2024'
    },
    toDate: {
      day: 'abc',
      month: '1',
      year: '2025'
    },
    expectedErrors: [
      {
        message: 'To date must be a valid date',
        errorField: 'date-to'
      }
    ]
  },
  invalid_calendar_from_date: {
    fromDate: {
      day: '31',
      month: '2',
      year: '2024'
    },
    toDate: {
      day: '31',
      month: '7',
      year: '2024'
    },
    expectedErrors: [
      {
        message: 'From date must be a valid date',
        errorField: 'date-from'
      }
    ]
  },
  from_date_after_to_date: {
    fromDate: {
      day: '01',
      month: '12',
      year: '2024'
    },
    toDate: {
      day: '01',
      month: '1',
      year: '2024'
    },
    expectedErrors: [
      {
        message: 'To date must be later than From date',
        errorField: 'date-to'
      }
    ]
  },
  both_dates_invalid: {
    fromDate: {
      day: '01',
      month: '44',
      year: '2024'
    },
    toDate: {
      day: '01',
      month: '55',
      year: '2024'
    },
    expectedErrors: [
      {
        message: 'From date must be a valid date',
        errorField: 'date-from'
      }
    ]
  }
}

function parseIsoDate(isoDate) {
  const [year, month, day] = isoDate.split('-')
  return {
    day,
    month,
    year
  }
}

function formatDate(dateInput, options) {
  return new Intl.DateTimeFormat('en-GB', {
    timeZone: 'UTC',
    ...options
  }).format(new Date(dateInput))
}

export function parseIsoDateToFormFields(isoDate) {
  return parseIsoDate(isoDate)
}

export function sortOrganisationsForReport(organisations) {
  return [...organisations].sort((a, b) => {
    const dateDifference =
      new Date(b.dateRegistered).getTime() -
      new Date(a.dateRegistered).getTime()

    if (dateDifference !== 0) {
      return dateDifference
    }

    return b.organisationId.localeCompare(a.organisationId)
  })
}

export function formatRegisteredDateForDisplay(isoDate) {
  return formatDate(isoDate, {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).replace('Sept', 'Sep')
}

export function formatRegisteredDateForCsv(isoDate) {
  return formatDate(isoDate, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  }).replace('Sept', 'Sep')
}

export function formatSearchDateForDisplay(isoDate) {
  return formatDate(`${isoDate}T00:00:00.000Z`, {
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  })
}

export function formatSearchDateAsYymmdd(isoDate) {
  const [year, month, day] = isoDate.split('-')
  return `${year.slice(2)}${month}${day}`
}

export function buildExpectedCsvFilenameRegex(startDate, endDate) {
  const start = formatSearchDateAsYymmdd(startDate)
  const end = formatSearchDateAsYymmdd(endDate)
  return new RegExp(`^\\d{12}-orgs-${start}-${end}\\.csv$`)
}

export function mapExpectedCsvRows(expectedOrganisations) {
  return sortOrganisationsForReport(expectedOrganisations).map((org) => ({
    organisationId: org.organisationId,
    registered: formatRegisteredDateForCsv(org.dateRegistered),
    activeApiCodeCount: org.activeApiCodeCount
  }))
}

function sortByOrganisationId(organisations) {
  return [...organisations].sort((a, b) =>
    a.organisationId.localeCompare(b.organisationId)
  )
}

export function assertOrganisationsMatch(actual, expected) {
  const sortedActual = sortByOrganisationId(actual)
  const sortedExpected = sortByOrganisationId(expected)
  expect(sortedActual).toHaveLength(sortedExpected.length)
  for (let i = 0; i < sortedExpected.length; i++) {
    expect(sortedActual[i]).toEqual(sortedExpected[i])
  }
}

export function assertActiveApiCodeCounts(actual, expected) {
  for (const expectedOrg of expected) {
    const actualOrg = actual.find(
      (org) => org.organisationId === expectedOrg.organisationId
    )
    expect(actualOrg).toBeDefined()
    expect(actualOrg.activeApiCodeCount).toBe(expectedOrg.activeApiCodeCount)
  }
}

export function assertOrganisationsOrderedByOrganisationId(actual, expected) {
  const actualIds = actual.map((org) => org.organisationId)
  const expectedIds = expected.map((org) => org.organisationId)
  expect(actualIds).toEqual(expectedIds)
}

export function assertOrganisationsOrderedByDateRegisteredDesc(actual) {
  for (let i = 0; i < actual.length - 1; i++) {
    const current = new Date(actual[i].dateRegistered).getTime()
    const next = new Date(actual[i + 1].dateRegistered).getTime()
    expect(current).toBeGreaterThanOrEqual(next)
  }
}

export function assertBadRequestResponse(response, expectedError) {
  expect(response.statusCode).toBe(expectedError.statusCode)
  expect(response.json.statusCode).toBe(expectedError.statusCode)
  expect(response.json.error).toBe(expectedError.error)
  if (expectedError.message) {
    expect(response.json.message).toBe(expectedError.message)
  }
  expect(response.json.validation).toEqual(expectedError.validation)
}
