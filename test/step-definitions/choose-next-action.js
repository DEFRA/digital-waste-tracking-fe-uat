import { Given } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'

Given('user selects option to view his api code', async function () {
  await NextActionPage.selectNextAction('connectYourSoftware')
})

Given(
  'user selects option to upload waste movements using a spreadsheet',
  async function () {
    await NextActionPage.selectNextAction('uploadSpreadsheet')
  }
)

Given(
  'user selects option to download spreadsheet template',
  async function () {
    await NextActionPage.selectNextAction('downloadSpreadsheet')
  }
)

Given(
  'user selects option to update waste movements using a spreadsheet',
  async function () {
    await NextActionPage.selectNextAction('updateSpreadsheet')
  }
)
