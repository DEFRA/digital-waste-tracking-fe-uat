import { parse } from 'csv-parse/sync'

export const WASTE_ORGANISATIONS_CSV_HEADERS = [
  'Organisation name',
  'Organisation ID',
  'Local authority',
  'Active API codes',
  'Registered (UTC)'
]

const COLUMN_ALIASES = {
  name: ['Organisation name'],
  organisationId: ['Organisation ID'],
  localAuthority: ['Local authority'],
  registered: ['Registered (UTC)'],
  activeApiCodeCount: ['Active API codes', 'Active API Codes']
}

function getColumnValue(row, aliases) {
  for (const alias of aliases) {
    if (row[alias] !== undefined) {
      return row[alias]
    }
  }

  throw new Error(
    `CSV row is missing expected column. Expected one of: ${aliases.join(', ')}`
  )
}

function normaliseCsvRow(row) {
  return {
    name: getColumnValue(row, COLUMN_ALIASES.name).trim(),
    organisationId: getColumnValue(row, COLUMN_ALIASES.organisationId).trim(),
    localAuthority: getColumnValue(row, COLUMN_ALIASES.localAuthority).trim(),
    registered: getColumnValue(row, COLUMN_ALIASES.registered).trim(),
    activeApiCodeCount: Number(
      getColumnValue(row, COLUMN_ALIASES.activeApiCodeCount)
    )
  }
}

export function parseWasteOrganisationsCsv(csvText) {
  const records = parse(csvText, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    bom: true
  })

  if (records.length === 0) {
    return []
  }

  const headers = Object.keys(records[0])
  // In the same order as the report's columns
  expect(headers).toEqual(WASTE_ORGANISATIONS_CSV_HEADERS)

  return records.map(normaliseCsvRow)
}

export function assertWasteOrganisationsCsvMatches(actualRows, expectedRows) {
  expect(actualRows).toHaveLength(expectedRows.length)

  const actualOrganisationIds = actualRows.map((row) => row.organisationId)
  const expectedOrganisationIds = expectedRows.map((row) => row.organisationId)
  expect(actualOrganisationIds).toEqual(expectedOrganisationIds)

  for (let i = 0; i < expectedRows.length; i++) {
    expect(actualRows[i].name).toBe(expectedRows[i].name)
    expect(actualRows[i].organisationId).toBe(expectedRows[i].organisationId)
    expect(actualRows[i].localAuthority).toBe(expectedRows[i].localAuthority)
    expect(actualRows[i].registered).toBe(expectedRows[i].registered)
    expect(actualRows[i].activeApiCodeCount).toBe(
      expectedRows[i].activeApiCodeCount
    )
  }
}
