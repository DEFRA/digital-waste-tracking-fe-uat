import { When, Given } from '@cucumber/cucumber'
import { getRandomPage } from '../utils/page'
import NextActionPage from '../page-objects/next-action.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'

When('the user navigates to any page on the portal', async function () {
  this.currentPage = await getRandomPage()
  await this.currentPage.open()
})

Given(
  'the user navigates directly to report receipt of waste page on the portal',
  async function () {
    await NextActionPage.open()
  }
)

When(
  'user navigates to are you a permitted waste receiver page',
  async function () {
    await UKPermitPage.open()
  }
)
