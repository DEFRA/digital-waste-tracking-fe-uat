import { request, Agent, ProxyAgent, interceptors } from 'undici'
import ExcelJS from 'exceljs'
import logger from '@wdio/logger'

const log = logger('spreadsheet-parser')

export async function downloadAndParseSpreadsheet(presignedUrl, httpProxy) {
  const agentOptions = {
    connections: 1,
    pipelining: 1,
    headersTimeout: 60000,
    bodyTimeout: 60000,
    connect: { timeout: 15000 }
  }

  const baseDispatcher =
    httpProxy && typeof httpProxy === 'string' && httpProxy.trim().length > 0
      ? new ProxyAgent({ uri: httpProxy.trim(), ...agentOptions })
      : new Agent(agentOptions)

  const dispatcher = baseDispatcher.compose(
    interceptors.redirect({ maxRedirections: 5 })
  )

  const maxAttempts = 24
  const intervalMs = 5000

  try {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      log.info(
        `Downloading processed spreadsheet (attempt ${attempt}/${maxAttempts})`
      )

      const response = await request(presignedUrl, {
        method: 'GET',
        dispatcher
      })

      const buffer = Buffer.from(await response.body.arrayBuffer())
      log.info(
        `Response status: ${response.statusCode}, content-type: ${response.headers['content-type']}, size: ${buffer.length} bytes`
      )

      if (response.statusCode === 200) {
        const workbook = new ExcelJS.Workbook()
        await workbook.xlsx.load(buffer)
        return workbook
      }

      if (response.statusCode === 404 && attempt < maxAttempts) {
        log.info(
          `File not yet available, waiting ${intervalMs / 1000}s before retry`
        )
        await new Promise((resolve) => setTimeout(resolve, intervalMs))
        continue
      }

      throw new Error(
        `Failed to download processed spreadsheet: HTTP ${response.statusCode} - ${buffer.toString('utf8').substring(0, 500)}`
      )
    }

    throw new Error(
      `Processed spreadsheet not available after ${maxAttempts} attempts (${(maxAttempts * intervalMs) / 1000}s)`
    )
  } finally {
    await baseDispatcher.close()
  }
}

function getCellText(cell) {
  const value = cell.value
  if (value === null || value === undefined) {
    return ''
  }
  if (typeof value === 'object' && value.richText) {
    return value.richText.map((part) => String(part.text ?? '')).join('')
  }
  if (typeof value === 'object' && value.text) {
    return String(value.text)
  }
  if (typeof value === 'object' && value.result !== undefined) {
    return String(value.result ?? '')
  }
  return String(value)
}

const WTID_HEADER_PATTERNS = ['wtid', 'waste tracking id']

function isWtidHeader(cellText) {
  const normalised = cellText.toLowerCase().trim()
  return WTID_HEADER_PATTERNS.some((pattern) => normalised === pattern)
}

export function extractWtidsFromWorkbook(workbook) {
  const wtids = []

  workbook.eachSheet((worksheet) => {
    let wtidColumnIndex = null
    let headerRowNum = null

    for (let rowNum = 1; rowNum <= Math.min(10, worksheet.rowCount); rowNum++) {
      const row = worksheet.getRow(rowNum)
      row.eachCell((cell, colNumber) => {
        const text = getCellText(cell)
        if (isWtidHeader(text)) {
          wtidColumnIndex = colNumber
          headerRowNum = rowNum
        }
      })
      if (wtidColumnIndex !== null) {
        break
      }
    }

    if (wtidColumnIndex === null) {
      return
    }

    log.info(
      `WTID column found at col ${wtidColumnIndex}, header row ${headerRowNum} in sheet "${worksheet.name}"`
    )

    const dataStartRow = headerRowNum + 2
    for (let rowNum = dataStartRow; rowNum <= worksheet.rowCount; rowNum++) {
      const cell = worksheet.getRow(rowNum).getCell(wtidColumnIndex)
      const text = getCellText(cell).trim()
      if (text.length > 0) {
        wtids.push(text)
      }
    }

    log.info(`Extracted ${wtids.length} WTIDs from sheet "${worksheet.name}"`)
    if (wtids.length > 0) {
      log.info(`Sample WTIDs: ${JSON.stringify(wtids.slice(0, 3))}`)
    }
  })

  return wtids
}
