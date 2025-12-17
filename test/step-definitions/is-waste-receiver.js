import { Given } from '@wdio/cucumber-framework'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import IsWasteReceiverPage from '../page-objects/is-waste-receiver.page.js'

Given(
  'redirected to "Is <organisation name> a waste receiver?" page',
  async function () {
    // Set the pageName on the world object
    this.pageName = 'is-waste-receiver-page'
    await IsWasteReceiverPage.verifyUserIsOnIsWasteReceiverPage()

    if (this.tags.includes('@accessibility')) {
      await analyseAccessibility(this.axeBuilder, this.pageName)
    }
  }
)
