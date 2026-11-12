import { After, Given, When, Then } from '@wdio/cucumber-framework'
import { $, browser } from '@wdio/globals'
import SoftwareProvidersPage from '../page-objects/waste-organisation-admin-tool/software-providers.page.js'
import CreateClientCredentialsPage from '../page-objects/waste-organisation-admin-tool/create-client-credentials.page.js'
import ClientCredentialsPage from '../page-objects/waste-organisation-admin-tool/client-credentials.page.js'
import AdminToolLoginPage from '../page-objects/waste-organisation-admin-tool/login.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import {
  WasteMovementClientSyncAPI,
  resolveWasteMovementClientSyncBaseUrl
} from '../utils/apis/wasteMovementClientSyncApi.js'
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

function createClientSyncApi(context) {
  const configBaseUrl = context.testConfig.wasteMovementClientSyncApiBaseUrl
  if (!configBaseUrl) {
    throw new Error(
      'wasteMovementClientSyncApiBaseUrl is not set in the environment config file'
    )
  }

  const baseUrl = resolveWasteMovementClientSyncBaseUrl(
    configBaseUrl,
    context.env
  )
  const httpProxy = context.env.ZAP_PROXY_API_URL ?? context.env.HTTP_PROXY
  return new WasteMovementClientSyncAPI(baseUrl, httpProxy)
}

async function signInAndOpen(context, path, open, verify) {
  const baseUrl = context.testConfig.adminUiBaseUrl
  const { username, password } = getAdminUiCredentials(
    context.testConfig,
    context.env
  )

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

async function fetchClients(context) {
  const clientSyncApi = createClientSyncApi(context)
  try {
    context.clientsResponse = await clientSyncApi.getClients()
  } finally {
    await clientSyncApi.close()
  }

  if (context.clientsResponse.statusCode === 404) {
    context.expectedClients = []
    return
  }

  expect(context.clientsResponse.statusCode).toBe(200)
  expect(context.clientsResponse.json).toBeInstanceOf(Array)
  context.expectedClients = context.clientsResponse.json
}

Given('the user navigates to the software providers page', async function () {
  this.pageName = 'software-providers-page'
  await signInAndOpen(
    this,
    SOFTWARE_PROVIDERS_PATH,
    (baseUrl) => SoftwareProvidersPage.open(baseUrl),
    (baseUrl) => SoftwareProvidersPage.verifyPageIsDisplayed(baseUrl)
  )
})

Given('the user is on the create client credentials page', async function () {
  this.pageName = 'create-client-credentials-page'
  const caption = createCredentialsCaption(this.env.ENVIRONMENT)
  await signInAndOpen(
    this,
    '/software-providers/create',
    (baseUrl) => CreateClientCredentialsPage.open(baseUrl),
    (baseUrl) =>
      CreateClientCredentialsPage.verifyPageIsDisplayed(baseUrl, caption)
  )
})

When('the get-all-clients endpoint is called', async function () {
  await fetchClients(this)
})

When('the user selects create new credentials', async function () {
  await SoftwareProvidersPage.clickCreateCredentials()
})

When('the user selects cancel', async function () {
  await CreateClientCredentialsPage.clickCancel()
})

When(
  'the user generates credentials for the {string} client name',
  async function (fixtureKey) {
    const fixture = validationFixture(fixtureKey)
    this.enteredClientName = fixture.clientName
    this.expectedClientNameError = fixture.error
    await CreateClientCredentialsPage.enterClientName(fixture.clientName)
    await CreateClientCredentialsPage.clickGenerateCredentials()
  }
)

When(
  'the user generates credentials for an existing client name in a different case',
  async function () {
    if (!this.expectedClients?.length) {
      await fetchClients(this)
    }
    const existing = this.expectedClients.find((client) => client.clientName)
    if (!existing) {
      throw new Error(
        'No existing client name is available for the duplicate check'
      )
    }

    this.enteredClientName = differentCase(existing.clientName)
    this.expectedClientNameError =
      'A client with this name already exists. Enter a different client name'
    await SoftwareProvidersPage.clickCreateCredentials()
    await CreateClientCredentialsPage.enterClientName(this.enteredClientName)
    await CreateClientCredentialsPage.clickGenerateCredentials()
  }
)

When('the user generates credentials for a new client', async function () {
  this.createdClientName = uniqueClientName()
  await CreateClientCredentialsPage.enterClientName(this.createdClientName)
  await CreateClientCredentialsPage.clickGenerateCredentials()
})

When(
  'the user generates credentials for a long wrapping client name',
  async function () {
    this.createdClientName = longWrappingClientName()
    await CreateClientCredentialsPage.enterClientName(this.createdClientName)
    await CreateClientCredentialsPage.clickGenerateCredentials()
    await ClientCredentialsPage.clientId.waitForDisplayed()
    this.createdClientId = await ClientCredentialsPage.clientIdText()
  }
)

When('the user copies the client credentials', async function () {
  await ClientCredentialsPage.clickCopy()
})

When('the user closes the client credentials page', async function () {
  this.credentialsUrl = await browser.getUrl()
  await ClientCredentialsPage.clickClose()
})

When('the user sorts the {string} column', async function (columnName) {
  await SoftwareProvidersPage.sortBy(columnName)
})

When('the user returns to the client credentials page', async function () {
  await browser.url(this.credentialsUrl)
})

Then(
  'the create client credentials page should be displayed',
  async function () {
    await CreateClientCredentialsPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl,
      createCredentialsCaption(this.env.ENVIRONMENT)
    )
  }
)

Then('the software providers page should be displayed', async function () {
  await SoftwareProvidersPage.verifyPageIsDisplayed(
    this.testConfig.adminUiBaseUrl
  )
})

Then('the software providers page should list every client', async function () {
  await SoftwareProvidersPage.verifyCreateCredentialsButton()
  await SoftwareProvidersPage.verifyClientsAreDisplayed(
    this.expectedClients,
    softwareProviderEnvironmentLabel(this.env.ENVIRONMENT)
  )
})

Then(
  'the {string} column should be sorted {string}',
  async function (columnName, direction) {
    await SoftwareProvidersPage.verifyColumnSort(columnName, direction)
  }
)

Then('the client name error should be displayed', async function () {
  await CreateClientCredentialsPage.verifyClientNameError(
    this.enteredClientName,
    this.expectedClientNameError
  )
})

Then('the new client credentials should be displayed', async function () {
  await ClientCredentialsPage.clientId.waitForDisplayed()
  this.createdClientId = await ClientCredentialsPage.clientIdText()
  await ClientCredentialsPage.verifyPageIsDisplayed({
    environmentLabel: credentialsPanelEnvironment(this.env.ENVIRONMENT),
    apiUrl: this.testConfig.wasteMovementExternalApiBaseUrl
  })
  this.pageName = 'client-credentials-page'
})

Then('the client credentials should be copied', async function () {
  await ClientCredentialsPage.verifyCredentialsWereCopied()
})

Then(
  'the new client should be listed on the software providers page',
  async function () {
    await SoftwareProvidersPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl
    )
    await SoftwareProvidersPage.verifyClientIsListed(
      this.createdClientName,
      this.createdClientId
    )
    await expect($('[data-testid="client-secret"]')).not.toBeExisting()
  }
)

Then(
  'the long client name should be fully visible and wrap onto a second line',
  async function () {
    await SoftwareProvidersPage.verifyPageIsDisplayed(
      this.testConfig.adminUiBaseUrl
    )
    await SoftwareProvidersPage.verifyClientIsListed(
      this.createdClientName,
      this.createdClientId
    )
    await SoftwareProvidersPage.verifyLongClientNameWraps(
      this.createdClientName
    )
  }
)

Then(
  'the software providers table should use the wrapping styles',
  async function () {
    await SoftwareProvidersPage.verifyWrappingStyles()
  }
)

Then(
  'the software providers page should not scroll sideways',
  async function () {
    await SoftwareProvidersPage.verifyPageDoesNotScrollHorizontally()
  }
)

Then(
  'the software providers page should generate accessibility tests',
  async function () {
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

Then(
  'the create client credentials page should generate accessibility tests',
  async function () {
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

Then(
  'the client credentials page should generate accessibility tests',
  async function () {
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

After(async function () {
  if (!this.createdClientId) {
    return
  }

  const clientSyncApi = createClientSyncApi(this)
  try {
    const response = await clientSyncApi.deleteClient(
      this.createdClientId,
      true
    )
    if (![200, 204].includes(response.statusCode)) {
      throw new Error(
        `Deleting client ${this.createdClientId} returned ${response.statusCode}`
      )
    }
  } finally {
    await clientSyncApi.close()
  }
})
