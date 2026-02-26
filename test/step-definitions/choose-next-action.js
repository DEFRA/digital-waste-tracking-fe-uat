import { Then, Given } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

Then(
  'user is redirected to "What do you want to do next?" page',
  async function () {
    this.pageName = 'choose-next-action-page'
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
    await NextActionPage.verifyUserIsOnChooseNextActionPage()
  }
)

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
