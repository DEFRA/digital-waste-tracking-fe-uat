import { Then } from '@wdio/cucumber-framework'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import { Page } from '../page-objects/page.js'
import { PAGE_REGISTRY } from '../utils/page-registry.js'

const page = new Page()

Then(
  /^(the )?user should be redirected to "([a-zA-Z0-9\-\s,]+)" page(| of that business| of that new business)$/,
  async function (x, pageString, y) {
    const entry = PAGE_REGISTRY.get(pageString)
    if (!entry) {
      throw new Error(
        `No page registry entry found for "${pageString}". Add it to test/utils/page-registry.js.`
      )
    }
    this.pageName = entry.pageName
    await entry.verify(this)
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

Then(
  'user should be presented with an error message as below',
  async function (dataTable) {
    const rows = dataTable.hashes()
    await page.verifyErrorMessage(rows[0].message)
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)
