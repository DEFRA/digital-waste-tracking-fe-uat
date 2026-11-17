import { Given, Then, When } from '@wdio/cucumber-framework'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import { Page } from '../page-objects/page.js'
import { PAGE_REGISTRY } from '../utils/page-registry.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'

const page = new Page()

Then(
  /^(the )?user should be redirected to "([a-zA-Z0-9\-\s,]+)" page(| of that business| of that new business)$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    x,
    pageString,
    y
  ) {
    const entry = PAGE_REGISTRY.get(pageString)
    if (!entry) {
      throw new Error(
        `No page registry entry found for "${pageString}". Add it to test/utils/page-registry.js.`
      )
    }
    this.testMemory.pageName = entry.pageName
    await entry.verify(this)
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

Then(
  'user should be presented with an error message as below',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    dataTable
  ) {
    const rows = dataTable.hashes()
    await page.verifyErrorMessage(rows[0].message)
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

When(
  'the user selects the {string} banner link',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    s
  ) {
    await page.click(page.reportReceiptOfWasteBanner)
  }
)

When(
  'user switches to {string} language',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    lang
  ) {
    await page.switchLanguage(lang)
  }
)

Then(
  'user should see his preference changed to {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    lang
  ) {
    await page.verifyLanguageCookieIsSet(lang)
    page.usersLanguagePreference = lang
  }
)

Given(
  'user launches report receipt of waste service',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await UKPermitPage.open()
  }
)

Given(
  'browsers language cookie is set to {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    s
  ) {
    await page.setLanguageCookie(s)
  }
)

Given(
  'user should see the content in {string} on {string} page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    lang,
    pageString
  ) {
    const targetLang = lang === 'Welsh' ? 'cy' : 'en'
    // page.usersLanguagePreference = targetLang
    switch (pageString) {
      case 'account-home':
        await MyAccountHomePage.verifyPageTitle(null, targetLang)
        await MyAccountHomePage.verifyPageHeading(null, targetLang)
        break
      case 'uk-permit':
        await UKPermitPage.verifyPageTitle(null, targetLang)
        await UKPermitPage.verifyPageHeading(null, targetLang)
        break
      default:
        throw new Error(`Unsupported page: ${pageString}`)
    }
  }
)
