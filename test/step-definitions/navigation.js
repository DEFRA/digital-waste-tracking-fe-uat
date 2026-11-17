import { When, Given } from '@cucumber/cucumber'
import { getRandomPage } from '../utils/page.js'
import NextActionPage from '../page-objects/next-action.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'

When(
  'the user navigates to any page on the portal',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.currentPage = await getRandomPage()
    await this.testMemory.currentPage.open()
  }
)

Given(
  'the user navigates directly to report receipt of waste page on the portal',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await NextActionPage.open()
  }
)

When(
  'user navigates to are you a permitted waste receiver page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await UKPermitPage.open()
  }
)
