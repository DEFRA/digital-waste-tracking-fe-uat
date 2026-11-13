import { After, Given, When, Then } from '@wdio/cucumber-framework'
import { $, browser } from '@wdio/globals'
import SoftwareProvidersPage from '../page-objects/waste-organisation-admin-tool/software-providers.page.js'
import CreateClientCredentialsPage from '../page-objects/waste-organisation-admin-tool/create-client-credentials.page.js'
import ClientCredentialsPage from '../page-objects/waste-organisation-admin-tool/client-credentials.page.js'
import SoftwareProviderPage from '../page-objects/waste-organisation-admin-tool/software-provider.page.js'
import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import { CLIENT_NAME_VALIDATION_FIXTURES } from '../data/software-provider-fixtures.js'
import { getAdminUiCredentials } from '../utils/admin-tool-credentials.js'
import {
  createCredentialsCaption,
  credentialsPanelEnvironment,
  differentCase,
  longWrappingClientName,
  softwareProviderEnvironmentLabel,
  uniqueClientName
} from '../utils/software-provider-environment.js'

const SOFTWARE_PROVIDERS_PATH = '/software-providers'

/**
 * @param {import('../types/globals.js').CucumberWorld} world
 * @param {string} path
 * @param {(baseUrl: string) => Promise<unknown>} open
 * @param {(baseUrl: string) => Promise<unknown>} verify
 */
async function signInAndOpen(world, path, open, verify) {
  const baseUrl = world.testConfig.adminUiBaseUrl
  const { username, password } = getAdminUiCredentials(world)

  await open(baseUrl)
  await AdminToolLoginPage.verifyLoginPageIsDisplayed(baseUrl, path)
  await AdminToolLoginPage.login(username, password)
  await verify(baseUrl)
}

function validationFixture(fixtureKey) {
  const fixture = CLIENT_NAME_VALIDATION_FIXTURES[fixtureKey]
  if (!fixture) {
    throw new Error(`Unknown client name fixture: ${fixtureKey}`)
  }
  return fixture
}

/**
 * @param {import('../types/globals.js').CucumberWorld} world
 */
async function fetchClients(world) {
  const response =
    await world.testMemory.apis.wasteMovementClientSyncAPI.getClients()
  world.testMemory.clientsResponse = response

  if (response.statusCode === 404) {
    world.testMemory.expectedClients = []
    return
  }

  expect(response.statusCode).toBe(200)
  expect(response.json).toBeInstanceOf(Array)
  world.testMemory.expectedClients = response.json
}

Given(
  'the user navigates to the software providers page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.pageName = 'software-providers-page'
    await signInAndOpen(
      this,
      SOFTWARE_PROVIDERS_PATH,
      (baseUrl) => SoftwareProvidersPage.open(baseUrl),
      (baseUrl) => SoftwareProvidersPage.verifyPageIsDisplayed(baseUrl)
    )
  }
)

Given(
  'the user is on the create client credentials page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.pageName = 'create-client-credentials-page'
    const caption = createCredentialsCaption(this.testEnv.environment)
    await signInAndOpen(
      this,
      '/software-providers/create',
      (baseUrl) => CreateClientCredentialsPage.open(baseUrl),
      (baseUrl) =>
        CreateClientCredentialsPage.verifyPageIsDisplayed(baseUrl, caption)
    )
  }
)

When(
  'the get-all-clients endpoint is called',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await fetchClients(this)
  }
)

When(
  'the user selects create new credentials',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.clickCreateCredentials()
  }
)

When(
  'the user selects cancel',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await CreateClientCredentialsPage.clickCancel()
  }
)

When(
  'the user generates credentials for the {string} client name',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    fixtureKey
  ) {
    const fixture = validationFixture(fixtureKey)
    this.testMemory.enteredClientName = fixture.clientName
    this.testMemory.expectedClientNameError = fixture.error
    await CreateClientCredentialsPage.enterClientName(fixture.clientName)
    await CreateClientCredentialsPage.clickGenerateCredentials()
  }
)

When(
  'the user generates credentials for an existing client name in a different case',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    if (!this.testMemory.expectedClients?.length) {
      await fetchClients(this)
    }
    const existing = this.testMemory.expectedClients.find(
      (client) => client.clientName
    )
    if (!existing?.clientName) {
      throw new Error(
        'No existing client name is available for the duplicate check'
      )
    }

    this.testMemory.enteredClientName = differentCase(existing.clientName)
    this.testMemory.expectedClientNameError =
      'A client with this name already exists. Enter a different client name'
    await SoftwareProvidersPage.clickCreateCredentials()
    await CreateClientCredentialsPage.enterClientName(
      this.testMemory.enteredClientName
    )
    await CreateClientCredentialsPage.clickGenerateCredentials()
  }
)

When(
  'the user generates credentials for a new client',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.createdClientName = uniqueClientName()
    await CreateClientCredentialsPage.enterClientName(
      this.testMemory.createdClientName
    )
    await CreateClientCredentialsPage.clickGenerateCredentials()
  }
)

When(
  'the user generates credentials for a long wrapping client name',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.createdClientName = longWrappingClientName()
    await CreateClientCredentialsPage.enterClientName(
      this.testMemory.createdClientName
    )
    await CreateClientCredentialsPage.clickGenerateCredentials()
    await ClientCredentialsPage.clientId.waitForDisplayed()
    this.testMemory.createdClientId = await ClientCredentialsPage.clientIdText()
  }
)

When(
  'the user copies the client credentials',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ClientCredentialsPage.clickCopy()
  }
)

When(
  'the user closes the client credentials page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.credentialsUrl = await browser.getUrl()
    await ClientCredentialsPage.clickClose()
  }
)

When(
  'the user sorts the {string} column',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    columnName
  ) {
    await SoftwareProvidersPage.sortBy(columnName)
  }
)

When(
  'the user goes to the software providers page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.open(this.testConfig.adminUiBaseUrl)
  }
)

When(
  'the user returns to the client credentials page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await browser.url(this.testMemory.credentialsUrl)
  }
)

Then(
  'the create client credentials page should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await CreateClientCredentialsPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl,
      createCredentialsCaption(this.testEnv.environment)
    )
  }
)

Then(
  'the software providers page should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl
    )
  }
)

Then(
  'the software providers page should list every client',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyCreateCredentialsButton()
    await SoftwareProvidersPage.verifyClientsAreDisplayed(
      this.testMemory.expectedClients,
      softwareProviderEnvironmentLabel(this.testEnv.environment)
    )
  }
)

Then(
  'the {string} column should be sorted {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    columnName,
    direction
  ) {
    await SoftwareProvidersPage.verifyColumnSort(columnName, direction)
  }
)

Then(
  'the client name error should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await CreateClientCredentialsPage.verifyClientNameError(
      this.testMemory.enteredClientName,
      this.testMemory.expectedClientNameError
    )
  }
)

Then(
  'the new client credentials should be displayed',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ClientCredentialsPage.clientId.waitForDisplayed()
    this.testMemory.createdClientId = await ClientCredentialsPage.clientIdText()
    await ClientCredentialsPage.verifyPageIsDisplayed({
      clientName: this.testMemory.createdClientName,
      environmentLabel: credentialsPanelEnvironment(this.testEnv.environment),
      apiUrl: this.testConfig.wasteMovementExternalApiBaseUrl
    })
    this.testMemory.pageName = 'client-credentials-page'
  }
)

Then(
  'the client credentials should be copied',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ClientCredentialsPage.verifyCredentialsWereCopied()
  }
)

Then(
  "the new client's software provider page should be displayed",
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProviderPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl,
      this.testMemory.createdClientId,
      this.testMemory.createdClientName
    )
  }
)

Then(
  'the new client should be listed on the software providers page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl
    )
    await SoftwareProvidersPage.verifyClientIsListed(
      this.testMemory.createdClientName,
      this.testMemory.createdClientId
    )
    await expect($('[data-testid="client-secret"]')).not.toBeExisting()
  }
)

Then(
  'the long client name should be fully visible and wrap onto a second line',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl
    )
    await SoftwareProvidersPage.verifyClientIsListed(
      this.testMemory.createdClientName,
      this.testMemory.createdClientId
    )
    await SoftwareProvidersPage.verifyLongClientNameWraps(
      this.testMemory.createdClientName
    )
  }
)

Then(
  'the software providers page should not scroll sideways',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await SoftwareProvidersPage.verifyPageDoesNotScrollHorizontally()
  }
)

Then(
  'the software providers page should generate accessibility tests',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

Then(
  'the create client credentials page should generate accessibility tests',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

Then(
  'the client credentials page should generate accessibility tests',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

After(
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const clientId = this.testMemory?.createdClientId
    const clientSyncApi = this.testMemory?.apis?.wasteMovementClientSyncAPI
    if (!clientId || !clientSyncApi) return

    const response = await clientSyncApi.deleteClient(clientId, true)
    if (![200, 204].includes(response.statusCode)) {
      throw new Error(
        `Deleting client ${clientId} returned ${response.statusCode}`
      )
    }
  }
)
