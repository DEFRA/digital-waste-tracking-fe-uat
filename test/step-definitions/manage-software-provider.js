import { When, Then } from '@wdio/cucumber-framework'
import { browser } from '@wdio/globals'
import SoftwareProviderPage from '../page-objects/waste-organisation-admin-tool/software-provider.page.js'
import SoftwareProvidersPage from '../page-objects/waste-organisation-admin-tool/software-providers.page.js'
import ReplaceSecretPage from '../page-objects/waste-organisation-admin-tool/replace-secret.page.js'
import RemoveSecretPage from '../page-objects/waste-organisation-admin-tool/remove-secret.page.js'
import DeleteSoftwareProviderPage from '../page-objects/waste-organisation-admin-tool/delete-software-provider.page.js'
import ClientCredentialsPage from '../page-objects/waste-organisation-admin-tool/client-credentials.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import { verifySecurityTeamEmail } from '../page-objects/waste-organisation-admin-tool/security-team-email.js'

/**
 * @param {import('../types/globals.js').CucumberWorld} world
 */
function createdClient(world) {
  return {
    baseUrl: world.testConfig.adminUiBaseUrl,
    clientId: world.testMemory.createdClientId,
    clientName: world.testMemory.createdClientName,
    environment: world.testEnv.environment
  }
}

When(
  'the user adds another secret',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.clickAddAnotherSecret()
  }
)

When(
  'the user selects replace secret',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.clickReplaceSecret()
  }
)

When(
  'the user selects remove secret',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.clickRemoveSecret()
  }
)

When(
  'the user selects delete software provider',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.clickDeleteSoftwareProvider()
  }
)

When(
  'the user goes back to the software provider',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const url = await browser.getUrl()
    if (url.endsWith('/replace')) {
      await ReplaceSecretPage.clickBack()
      return
    }
    if (url.endsWith('/remove')) {
      await RemoveSecretPage.clickBack()
      return
    }
    if (url.endsWith('/delete')) {
      await DeleteSoftwareProviderPage.clickBack()
      return
    }
    throw new Error(`There is no way back to the software provider from ${url}`)
  }
)

When(
  'the user confirms replacing the secret',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ReplaceSecretPage.clickConfirm()
  }
)

When(
  'the user confirms removing the secret',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await RemoveSecretPage.clickConfirm()
  }
)

When(
  'the user confirms deleting the software provider',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DeleteSoftwareProviderPage.clickConfirm()
  }
)

When(
  'the user reloads the software provider page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await browser.refresh()
  }
)

When(
  'the user reloads the software providers page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await browser.refresh()
  }
)

When(
  'the user opens the deleted software provider',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const { baseUrl, clientId } = createdClient(this)
    await browser.url(
      `${baseUrl}/software-providers/${encodeURIComponent(clientId)}`
    )
  }
)

Then(
  'the software provider page should show one secret',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.pageName = 'software-provider-page'
    const client = createdClient(this)
    await SoftwareProviderPage.verifyOneSecret(
      client.baseUrl,
      client.clientId,
      client.clientName,
      client.environment
    )
  }
)

Then(
  'the software provider page should show two secrets',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.pageName = 'software-provider-page'
    const client = createdClient(this)
    this.testMemory.olderSecretGeneratedOn =
      await SoftwareProviderPage.verifyTwoSecrets(
        client.baseUrl,
        client.clientId,
        client.clientName,
        client.environment
      )
  }
)

Then(
  'the newest secret should be tagged as new',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.verifyNewestSecretIsTaggedNew()
  }
)

Then(
  'the newest secret should not be tagged as new',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.verifyNewestSecretIsNotTaggedNew()
  }
)

Then(
  'the old client secret should not be shown',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ClientCredentialsPage.verifyOldSecretIsNotShown()
  }
)

Then(
  'the replace secret page should explain that the secret will stop working',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const client = createdClient(this)
    await ReplaceSecretPage.verifyPageIsDisplayed(
      client.baseUrl,
      client.clientId,
      client.clientName,
      client.environment
    )
  }
)

Then(
  'the remove secret page should explain that the older secret will stop working',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const client = createdClient(this)
    await RemoveSecretPage.verifyPageIsDisplayed(
      client.baseUrl,
      client.clientId,
      client.clientName,
      client.environment,
      this.testMemory.olderSecretGeneratedOn
    )
  }
)

Then(
  'the delete software provider page should explain that the whole record will be deleted',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const client = createdClient(this)
    await DeleteSoftwareProviderPage.verifyPageIsDisplayed(
      client.baseUrl,
      client.clientId,
      client.clientName,
      client.environment
    )
  }
)

Then(
  'the security team email should be ready to send',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const client = createdClient(this)
    await verifySecurityTeamEmail({
      clientId: client.clientId,
      clientName: client.clientName,
      environment: client.environment,
      apiUrl: this.testConfig.wasteMovementExternalApiBaseUrl
    })
  }
)

Then(
  'the secret removed message should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.verifySecretRemoved(
      this.testMemory.createdClientName
    )
  }
)

Then(
  'the secret removed message should not be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.verifySecretRemovedIsGone()
  }
)

Then(
  'the software provider deleted message should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl,
      this.testEnv.environment
    )
    await SoftwareProvidersPage.verifySoftwareProviderDeleted(
      this.testMemory.createdClientName
    )
  }
)

Then(
  'the deleted client should not be listed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyClientIsNotListed(
      this.testMemory.createdClientId
    )
  }
)

Then(
  'the software provider deleted message should not be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifySoftwareProviderDeletedIsGone()
  }
)

Then(
  'the software provider page should generate accessibility tests',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)
