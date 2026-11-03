import { Given, When, Then } from '@wdio/cucumber-framework'
import allure from '@wdio/allure-reporter'
import DefraIdChooseSignInPage from '../page-objects/defra-id-choose-sign-in.page.js'
import DefraIdGovtGatewayPage from '../page-objects/defra-id-govt-gateway.page.js'
import DefraIdGovUKPage from '../page-objects/defra-id-gov-uk.page.js'
import DefraIdStubPage from '../page-objects/defra-id-stub.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'
import LocalAuthorityGuidancePage from '../page-objects/local-authority-guidance.page.js'
import HomePage from '../page-objects/home.page.js'
import { getValueFromPool } from '@wdio/shared-store-service'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import DefraIdOrgPickerPage from '../page-objects/defra-id-org-picker.page.js'
import BasicAuthLoginPage from '../page-objects/basic-auth-login.page.js'

Given(
  'user proceeds to login using a Government Gateway account',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
    await DefraIdChooseSignInPage.selectSignInMethod('Government Gateway')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovtGatewayPage.setBaseUrl(this.testConfig.govtGatewayLoginUrl)
    await DefraIdGovtGatewayPage.verifyUserIsOnGovernmentGatewayLoginPage()
  }
)

Given(
  'user proceeds to login using a Gov.uk account',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
    await DefraIdChooseSignInPage.selectSignInMethod('GOV.UK One Login')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovUKPage.setBaseUrl(this.testConfig.govUKBaseUrl)
    await DefraIdGovUKPage.verifyUserIsOnGovUKLoginPage()
  }
)

When(
  'user enters their Government user Id and password',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    if (this.testEnv.environment === 'test') {
      this.testMemory.govGatewayUser = await getValueFromPool(
        'availableGovGatewayUsers'
      )
      await DefraIdGovtGatewayPage.loginWithGovernmentGateway(
        this.testMemory.govGatewayUser,
        this.testEnv.defraGovGatewayPassword
      )
    }
  }
)

Then(
  'they should be logged in successfully',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    // just a place holder step, might have to introduce a static wait
    // for the defra Id sync process to complete in future
    // await browser.pause(10000) // ToDo:temporary wait , to be removed before checkin
  }
)

When(
  'user enters their Gov.uk email address and password',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.govUKUser = await getValueFromPool('availableGovUKUsers')
    await DefraIdGovUKPage.loginWithGovUK(
      this.testMemory.govUKUser,
      this.testEnv.defraGovUkPassword
    )
  }
)

Given(
  'a user is registered in Defra Id mock service',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.userEmail = `test${Date.now()}@test.com`
    await DefraIdStubPage.open(this.testConfig.defraIdServiceUrl + '/register')
    const response = await this.testMemory.apis.defraIdStubAPI.registerNewUser(
      this.testMemory.userEmail
    )
    this.testMemory.defraIdMockUserId = response.json.userId
    this.testMemory.defraIdMockUser = this.testMemory.userEmail
    this.testMemory.originalUserEmail = this.testMemory.userEmail
  }
)

When(
  'user successfully logs in to the Defra Id mock service',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DefraIdStubPage.loginAsAUser(this.testMemory.userEmail)
  }
)

When(
  'user has selected a business',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DefraIdStubPage.selectFirstOrganisation()
  }
)

async function continueFromLocalAuthorityPage(isLocalAuthority) {
  await UKPermitPage.verifyUserIsOnUKPermitPage()
  if (isLocalAuthority) {
    await UKPermitPage.selectYesOption()
    await UKPermitPage.click(UKPermitPage.continueButton)
    await LocalAuthorityGuidancePage.verifyUserIsOnLocalAuthorityGuidancePage()
    await LocalAuthorityGuidancePage.click(
      LocalAuthorityGuidancePage.continueButton
    )
  } else {
    await UKPermitPage.selectNoOption()
    await UKPermitPage.click(UKPermitPage.continueButton)
  }
}

Then(
  'the organisation details should be available with local authority set to true',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const organisationDetails =
      await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
        this.testMemory.organisationId,
        this.testMemory.defraIdMockUserId
      )
    expect(organisationDetails.statusCode).toBe(200)
    expect(organisationDetails.json.organisation.isLocalAuthority).toBe(true)
  }
)

Then(
  'my organisation record should not be updated with my response',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const organisationDetails =
      await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationDetails(
        this.testMemory.organisationId,
        this.testMemory.defraIdMockUserId
      )
    expect(organisationDetails.statusCode).toBe(200)
    expect(organisationDetails.json.organisation).not.toHaveProperty(
      'isLocalAuthority'
    )
  }
)

async function registerAndLoginViaStub(context) {
  context.testMemory.userEmail = `test${Date.now()}@test.com`
  const response = await context.testMemory.apis.defraIdStubAPI.registerNewUser(
    context.testMemory.userEmail
  )
  context.testMemory.defraIdMockUserId = response.json.userId
  context.testMemory.defraIdMockUser = context.testMemory.userEmail
  context.testMemory.originalUserEmail = context.testMemory.userEmail

  await UKPermitPage.open()
  await continueFromLocalAuthorityPage(context.testMemory.isLocalAuthority)

  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    context.testConfig.defraIdServiceUrl
  )

  await DefraIdStubPage.loginAsAUser(context.testMemory.userEmail)

  const organisationDetails =
    await DefraIdStubPage.getFirstOrganisationDetails()
  context.testMemory.organisationId = organisationDetails.organisationId
  context.relationshipId = organisationDetails.relationshipId
  context.testMemory.organisationName = 'Some Receiver Org'
  await DefraIdStubPage.selectFirstOrganisation()

  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  // ToDo: when the free period ends beyond september 30th 2026
  // below code needs to be uncommented
  // if (!context.testMemory.tags.includes('@serviceCharge')) {
  //   const response1 =
  //     await context.testMemory.apis.wasteOrganisationBackendAPI.updateOrganisationDetails(
  //       context.testMemory.organisationId, {
  //         "organisation": {
  //           "disableAfter": '2027-09-30T00:00:00.000Z',
  //         }
  //       }
  //     )
  //   expect(response1.statusCode).toBe(200)
  //   await MyAccountHomePage.refreshPage()
  // }
}

async function registerAnotherUserViaDefraIdStub(context) {
  expect(context.testMemory.organisationId).toBeDefined()
  expect(context.testMemory.organisationName).toBeDefined()
  expect(context.relationshipId).toBeDefined()

  context.differentUserEmail = `test${Date.now()}@test.com`
  const response = await context.testMemory.apis.defraIdStubAPI.registerNewUser(
    context.differentUserEmail,
    {
      organisationId: context.relationshipId,
      relationshipId: context.testMemory.organisationId,
      organisationName: context.testMemory.organisationName
    }
  )
  expect([200, 201]).toContain(response.statusCode)
  context.testMemory.differentDefraIdMockUserId = response.json.userId
  context.differentUserOrganisationId = context.relationshipId
  context.differentUserRelationshipId = response.relationshipId
}

async function loginAnotherUserOfSameOrganisation(context) {
  expect(context.differentUserEmail).toBeDefined()
  expect(context.differentUserRelationshipId).toBeDefined()

  await loginToPortalViaStub(context, context.differentUserEmail)
  await DefraIdStubPage.selectFirstOrganisation()
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
}

async function registerAndLoginAnotherUserViaDefraIdStub(context) {
  await registerAnotherUserViaDefraIdStub(context)
  await loginAnotherUserOfSameOrganisation(context)
}

function scenarioUsesDefraIdStub(world) {
  const tags = world.testMemory.tags
  const hasStub = tags.includes('@defra-id-stub')
  const hasReal = tags.includes('@defra-id-real')
  if (hasStub && !hasReal) return true
  if (hasReal && !hasStub) return false

  const extra = world.testEnv.cucumberExtraTags
  const extraStub = extra.includes('@defra-id-stub')
  const extraReal = extra.includes('@defra-id-real')
  if (extraStub && !extraReal) return true
  if (extraReal && !extraStub) return false

  if (hasStub && hasReal) {
    throw new Error(
      'Scenario is tagged @defra-id-stub and @defra-id-real. Set CUCUMBER_EXTRA_TAGS to one of them.'
    )
  }

  throw new Error(
    'Scenario has no @defra-id-stub or @defra-id-real tag. Set CUCUMBER_EXTRA_TAGS to one of them.'
  )
}

async function loginToPortalViaStub(context, email) {
  // Reloads the browser, then repeats the ext-test login form check.
  await UKPermitPage.browserReloadSession()
  await UKPermitPage.open()
  await loginThroughBasicAuthIfPresented(context)
  await continueFromLocalAuthorityPage(context.testMemory.isLocalAuthority)
  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    context.testConfig.defraIdServiceUrl
  )

  await DefraIdStubPage.loginAsAUser(email)
}

async function loginOriginalUserToPortal(context) {
  expect(context.testMemory.originalUserEmail).toBeDefined()
  await loginToPortalViaStub(context, context.testMemory.originalUserEmail)
  await DefraIdStubPage.selectFirstOrganisation()
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
}

async function loginThroughBasicAuthIfPresented(context) {
  if (await BasicAuthLoginPage.isCurrentPage()) {
    await BasicAuthLoginPage.login(
      context.testEnv.basicAuthUsername,
      context.testEnv.basicAuthPassword
    )
  }
}

async function navigateToPortalAndLogin(context, accountType) {
  await UKPermitPage.open()
  await loginThroughBasicAuthIfPresented(context)
  await continueFromLocalAuthorityPage(context.testMemory.isLocalAuthority)
  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    context.testConfig.defraIdServiceUrl
  )

  await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()

  if (accountType === 'Government Gateway') {
    await DefraIdChooseSignInPage.selectSignInMethod('Government Gateway')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovtGatewayPage.setBaseUrl(
      context.testConfig.govtGatewayLoginUrl
    )
    await DefraIdGovtGatewayPage.verifyUserIsOnGovernmentGatewayLoginPage()

    if (context.testMemory.govGatewayUser === undefined)
      context.testMemory.govGatewayUser = await getValueFromPool(
        'availableGovGatewayUsers'
      )
    allure.addArgument('Test User Email', context.testMemory.govGatewayUser)
    await DefraIdGovtGatewayPage.loginWithGovernmentGateway(
      context.testMemory.govGatewayUser,
      context.testEnv.defraGovGatewayPassword
    )
  } else {
    await DefraIdChooseSignInPage.selectSignInMethod('GOV.UK One Login')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovUKPage.setBaseUrl(context.testConfig.govUKBaseUrl)
    await DefraIdGovUKPage.verifyUserIsOnGovUKLoginPage()

    if (context.testMemory.govUKUser === undefined)
      context.testMemory.govUKUser = await getValueFromPool(
        'availableGovUKUsers'
      )

    allure.addArgument('Test User Email', context.testMemory.govUKUser)
    await DefraIdGovUKPage.loginWithGovUK(
      context.testMemory.govUKUser,
      context.testEnv.defraGovUkPassword
    )
  }
}

Given(
  /^(?:a user is|I am) logged in to the waste receiver registration portal$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    if (
      this.testEnv.cucumberExtraTags.includes('@compatibility') &&
      this.testEnv.environment !== 'ext-test'
    ) {
      // pick a user from default pool
      const user = await getValueFromPool('availableUsers')
      if (user.includes('@')) {
        this.testMemory.govUKUser = user
        await navigateToPortalAndLogin(this, 'GOV.UK One Login')
      } else {
        this.testMemory.govGatewayUser = user
        await navigateToPortalAndLogin(this, 'Government Gateway')
      }
    } else if (scenarioUsesDefraIdStub(this)) {
      await registerAndLoginViaStub(this)
    } else {
      // pick a default Gov UK or Govt gateway user and login with it
      // only use this step for test if parallel open sessions of a user does not effect the test
      this.testMemory.govUKUser = this.testConfig.defaultGovUKLogin
      this.testMemory.doNotAddUserToPool = true
      await navigateToPortalAndLogin(this, 'GOV.UK One Login')
    }
  }
)

Given(
  /^(?:a user is|I am) logged in to the waste receiver registration portal using a "([^"]*)" account( as a local authority)?$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    accountType,
    asLocalAuthority
  ) {
    this.testMemory.isLocalAuthority =
      asLocalAuthority === ' as a local authority'
    if (scenarioUsesDefraIdStub(this)) {
      await registerAndLoginViaStub(this)
    } else {
      await navigateToPortalAndLogin(this, accountType)
    }
  }
)

Given(
  /^the (?:same|original) user logs back in to the waste receiver registration portal(?: selecting "(Yes|No)" for local authority)?$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    localAuthorityOption
  ) {
    if (localAuthorityOption === 'Yes' || localAuthorityOption === 'No') {
      this.testMemory.isLocalAuthority = localAuthorityOption === 'Yes'
    }
    await loginOriginalUserToPortal(this)
  }
)

When(
  'another user of the same organisation is registered and logged in to the waste receiver registration portal using the Defra ID mock service',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await registerAndLoginAnotherUserViaDefraIdStub(this)
  }
)

Given(
  'a multi-business user is logged in via {string}',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    accountType
  ) {
    this.testMemory.govUKUser = await getValueFromPool(
      'availableMultipleBusinessesGovUKUsers'
    )
    this.testMemory.userWithMultipleBusinesses = true

    await navigateToPortalAndLogin(this, accountType)

    await DefraIdOrgPickerPage.verifyUserIsOnOrgPickerPage()
    this.testMemory.selectedOrganisation =
      await DefraIdOrgPickerPage.selectOrganisation(0)
  }
)

Given(
  'a user is associated with multiple businesses',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.govUKUser = await getValueFromPool(
      'availableMultipleBusinessesGovUKUsers'
    )
    this.testMemory.userWithMultipleBusinesses = true
  }
)

Given(
  'the user has selected a business that he wants to act on behalf of',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await DefraIdOrgPickerPage.verifyUserIsOnOrgPickerPage()
    this.testMemory.selectedOrganisation =
      await DefraIdOrgPickerPage.selectOrganisation(0)
  }
)

Given(
  /^(?:a user is|I am) not logged in to the waste receiver registration portal$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    // Do nothing as we want to ensure user is not logged in for this step. Step definition is here to improve readability of the scenario
  }
)

When(
  'a user is logged in to the waste receiver registration portal with a {string} account',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    s
  ) {
    this.testMemory.govUKUser = this.testConfig.individualUserDefraAccLogin
    this.testMemory.doNotAddUserToPool = true
    await navigateToPortalAndLogin(this, 'GOV.UK One Login')
  }
)
