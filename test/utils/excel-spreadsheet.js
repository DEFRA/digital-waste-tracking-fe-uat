import ExcelJS from 'exceljs'
import logger from '@wdio/logger'

const log = logger('excel-spreadsheet')

const WASTE_MOVEMENT_LEVEL_SHEET = '7. Waste movement level'
const START_ROW = 9
const COLUMN_B = 2

/**
 * Modifies an Excel spreadsheet: writes values into the "waste movement level" sheet
 * in column B only, starting at row 9. Each list item is one cell (B9, B10, B11, …).
 *
 * @param {string} filePath - Full path to the spreadsheet file
 * @param {Array<*>} values - 1D list of cell values (e.g. ['123', '456'] -> B9='123', B10='456')
 * @returns {Promise<string>} Resolved with the full path of the modified file
 *  usage:await updateWasteMovementLevelSheet('./test/data/Test1-spreadsheet-1772658620348.xlsx', ['123', '456'])
 */
export async function updateWasteMovementLevelSheet(filePath, values) {
  log.info(
    `Updating "${WASTE_MOVEMENT_LEVEL_SHEET}" in ${filePath}, column B from row ${START_ROW}`
  )

  const workbook = new ExcelJS.Workbook()
  await workbook.xlsx.readFile(filePath)

  const sheet = workbook.getWorksheet(WASTE_MOVEMENT_LEVEL_SHEET)

  for (let i = 0; i < values.length; i++) {
    const cell = sheet.getCell(START_ROW + i, COLUMN_B)
    cell.value = values[i]
  }

  await workbook.xlsx.writeFile(filePath)
  log.info(`Updated ${values.length} cell(s) in column B`)
  return filePath
}
