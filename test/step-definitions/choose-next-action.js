import { Then } from '@wdio/cucumber-framework'
import NextActionPage from '../page-objects/next-action.page.js'

Then(
  'user is redirected to "What do you want to do next?" page',
  async function () {
    await NextActionPage.verifyUserIsOnChooseNextActionPage()
  }
)
