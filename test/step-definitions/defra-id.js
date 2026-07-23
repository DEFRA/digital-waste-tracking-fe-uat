import { Given, When, Then } from '@wdio/cucumber-framework'
import allure from '@wdio/allure-reporter'
import DefraIdChooseSignInPage from '../page-objects/defra-id-choose-sign-in.page.js'
import DefraIdGovtGatewayPage from '../page-objects/defra-id-govt-gateway.page.js'
import DefraIdGovUKPage from '../page-objects/defra-id-gov-uk.page.js'
import DefraIdStubPage from '../page-objects/defra-id-stub.page.js'
import UKPermitPage from '../page-objects/uk-permit.page.js'
import HomePage from '../page-objects/home.page.js'
import { getValueFromPool } from '@wdio/shared-store-service'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import DefraIdOrgPickerPage from '../page-objects/defra-id-org-picker.page.js'

Given(
  'user proceeds to login using a Government Gateway account',
  async function () {
    await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
    await DefraIdChooseSignInPage.selectSignInMethod('Government Gateway')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovtGatewayPage.setBaseUrl(this.testConfig.govtGatewayLoginUrl)
    await DefraIdGovtGatewayPage.verifyUserIsOnGovernmentGatewayLoginPage()
  }
)

Given('user proceeds to login using a Gov.uk account', async function () {
  await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
  await DefraIdChooseSignInPage.selectSignInMethod('GOV.UK One Login')
  await DefraIdChooseSignInPage.clickContinueButton()
  await DefraIdGovUKPage.setBaseUrl(this.testConfig.govUKBaseUrl)
  await DefraIdGovUKPage.verifyUserIsOnGovUKLoginPage()
})

When('user enters their Government user Id and password', async function () {
  if (this.env.ENVIRONMENT === 'test') {
    this.govGatewayUser = await getValueFromPool('availableGovGatewayUsers')
    await DefraIdGovtGatewayPage.loginWithGovernmentGateway(
      this.govGatewayUser,
      this.env.defraGovGatewayPassword
    )
  }
})

Then('they should be logged in successfully', async function () {
  // just a place holder step, might have to introduce a static wait
  // for the defra Id sync process to complete in future
  // await browser.pause(10000) // ToDo:temporary wait , to be removed before checkin
})

When('user enters their Gov.uk email address and password', async function () {
  this.govUKUser = await getValueFromPool('availableGovUKUsers')
  await DefraIdGovUKPage.loginWithGovUK(
    this.govUKUser,
    this.env.defraGovUKPassword
  )
})

Given('a user is registered in Defra Id mock service', async function () {
  this.userEmail = `test${Date.now()}@test.com`
  await DefraIdStubPage.open(this.testConfig.defraIdServiceUrl + '/register')
  const response = await this.apis.defraIdStubAPI.registerNewUser(
    this.userEmail
  )
  this.defraIdMockUserId = response.json.userId
  this.defraIdMockUser = this.userEmail
})

When(
  'user successfully logs in to the Defra Id mock service',
  async function () {
    await DefraIdStubPage.loginAsAUser(this.userEmail)
  }
)

When('user has selected a business', async function () {
  await DefraIdStubPage.selectFirstOrganisation()
})

async function registerAndLoginViaStub(context) {
  context.userEmail = `test${Date.now()}@test.com`
  const response = await context.apis.defraIdStubAPI.registerNewUser(
    context.userEmail
  )
  context.defraIdMockUserId = response.json.userId
  context.defraIdMockUser = context.userEmail

  await UKPermitPage.open()
  await UKPermitPage.verifyUserIsOnUKPermitPage()
  await UKPermitPage.selectNoOption()
  await UKPermitPage.click(UKPermitPage.continueButton)

  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    context.testConfig.defraIdServiceUrl
  )

  await DefraIdStubPage.loginAsAUser(context.userEmail)

  const temp = await DefraIdStubPage.getFirstOrganisationId()
  context.organisationId = temp
    .replace(/Organisation ID:/g, '')
    .replace(/\| Role: Employee/g, '')
    .trim()
  await DefraIdStubPage.selectFirstOrganisation()

  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  // ToDo: when the free period ends beyond september 30th 2026
  // below code needs to be uncommented
  // if (!context.tags.includes('@serviceCharge')) {
  //   const response1 =
  //     await context.apis.wasteOrganisationBackendAPI.updateOrganisationDetails(
  //       context.organisationId, {
  //         "organisation": {
  //           "disableAfter": '2027-09-30T00:00:00.000Z',
  //         }
  //       }
  //     )
  //   expect(response1.statusCode).toBe(200)
  //   await MyAccountHomePage.refreshPage()
  // }
}

async function navigateToPortalAndLogin(context, accountType) {
  await UKPermitPage.open()
  await UKPermitPage.verifyUserIsOnUKPermitPage()
  await UKPermitPage.selectNoOption()
  await UKPermitPage.click(UKPermitPage.continueButton)
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

    if (context.govGatewayUser === undefined)
      context.govGatewayUser = await getValueFromPool(
        'availableGovGatewayUsers'
      )
    allure.addArgument('Test User Email', context.govGatewayUser)
    await DefraIdGovtGatewayPage.loginWithGovernmentGateway(
      context.govGatewayUser,
      context.env.defraGovGatewayPassword
    )
  } else {
    await DefraIdChooseSignInPage.selectSignInMethod('GOV.UK One Login')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovUKPage.setBaseUrl(context.testConfig.govUKBaseUrl)
    await DefraIdGovUKPage.verifyUserIsOnGovUKLoginPage()

    if (context.govUKUser === undefined)
      context.govUKUser = await getValueFromPool('availableGovUKUsers')

    allure.addArgument('Test User Email', context.govUKUser)
    await DefraIdGovUKPage.loginWithGovUK(
      context.govUKUser,
      context.env.defraGovUKPassword
    )
  }
}

Given(
  /^(?:a user is|I am) logged in to the waste receiver registration portal$/,
  async function () {
    if (
      this.env.ENVIRONMENT === 'dev' ||
      this.env.ENVIRONMENT === 'local' ||
      this.env.ENVIRONMENT === 'perf-test'
    ) {
      await registerAndLoginViaStub(this)
    } else if (
      this.tags.includes('@browserstack') &&
      this.env.ENVIRONMENT !== 'ext-test'
    ) {
      // pick a user from default pool
      const user = await getValueFromPool('availableUsers')
      if (user.includes('@')) {
        this.govUKUser = user
        await navigateToPortalAndLogin(this, 'GOV.UK One Login')
      } else {
        this.govGatewayUser = user
        await navigateToPortalAndLogin(this, 'Government Gateway')
      }
    } else {
      // pick a default Gov UK or Govt gateway user and login with it
      // only use this step for test if parallel open sessions of a user does not effect the test
      this.govUKUser = this.testConfig.defaultGovUKLogin
      this.doNotAddUserToPool = true
      await navigateToPortalAndLogin(this, 'GOV.UK One Login')
    }
  }
)

Given(
  /^(?:a user is|I am) logged in to the waste receiver registration portal using a "([^"]*)" account$/,
  async function (accountType) {
    if (
      this.env.ENVIRONMENT === 'dev' ||
      this.env.ENVIRONMENT === 'local' ||
      this.env.ENVIRONMENT === 'perf-test'
    ) {
      await registerAndLoginViaStub(this)
    } else {
      await navigateToPortalAndLogin(this, accountType)
    }
  }
)

Given(
  'a multi-business user is logged in via {string}',
  async function (accountType) {
    this.govUKUser = await getValueFromPool(
      'availableMultipleBusinessesGovUKUsers'
    )
    this.userWithMultipleBusinesses = true

    await navigateToPortalAndLogin(this, accountType)

    await DefraIdOrgPickerPage.verifyUserIsOnOrgPickerPage()
    this.selectedOrganisation = await DefraIdOrgPickerPage.selectOrganisation(0)
  }
)

Given('a user is associated with multiple businesses', async function () {
  this.govUKUser = await getValueFromPool(
    'availableMultipleBusinessesGovUKUsers'
  )
  this.userWithMultipleBusinesses = true
})

Given(
  'the user has selected a business that he wants to act on behalf of',
  async function () {
    await DefraIdOrgPickerPage.verifyUserIsOnOrgPickerPage()
    this.selectedOrganisation = await DefraIdOrgPickerPage.selectOrganisation(0)
  }
)

Given(
  /^(?:a user is|I am) not logged in to the waste receiver registration portal$/,
  async function () {
    // Do nothing as we want to ensure user is not logged in for this step. Step definition is here to improve readability of the scenario
  }
)

When(
  'a user is logged in to the waste receiver registration portal with a {string} account',
  async function (s) {
    this.govUKUser = this.testConfig.individualUserDefraAccLogin
    this.doNotAddUserToPool = true
    await navigateToPortalAndLogin(this, 'GOV.UK One Login')
  }
)
