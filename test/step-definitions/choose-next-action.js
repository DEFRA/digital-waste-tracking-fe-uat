import { Then, Given } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'

Then(
  'user is redirected to "What do you want to do next?" page',
  async function () {
    await NextActionPage.verifyUserIsOnChooseNextActionPage()
  }
)

Given('user selects option to view his api code', async function () {
  await NextActionPage.selectConnectYourSoftwareRadio()
})
