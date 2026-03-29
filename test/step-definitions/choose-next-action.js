import { Given, When, Then } from '@wdio/cucumber-framework'
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

Then(
  'the user should be able to see the list of actions to choose from',
  async function () {
    await NextActionPage.verifyListOfActionsToChooseFrom()
  }
)

When(
  'user clicks on {string} button without selecting an action',
  async function (button) {
    await NextActionPage.click(NextActionPage.continueButton)
  }
)
