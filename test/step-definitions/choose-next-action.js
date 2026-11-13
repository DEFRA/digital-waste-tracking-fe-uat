import { Given, When, Then } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'

Given(
  'user selects option to view his api code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.selectNextAction('connectYourSoftware')
  }
)

Given(
  'user selects option to upload waste movements using a spreadsheet',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.selectNextAction('uploadSpreadsheet')
  }
)

Given(
  'user selects option to download spreadsheet template',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.selectNextAction('downloadSpreadsheet')
  }
)

Given(
  'user selects option to update waste movements using a spreadsheet',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.selectNextAction('updateSpreadsheet')
  }
)

Then(
  'the user should be able to see the list of actions to choose from',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.verifyListOfActionsToChooseFrom()
  }
)

When(
  'user clicks on {string} button without selecting an action',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    button
  ) {
    await NextActionPage.click(NextActionPage.continueButton)
  }
)

Then(
  'user should only have option to Download spreadsheet template',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.verifyOnlyDownloadSpreadsheetOptionIsAvailable()
  }
)
