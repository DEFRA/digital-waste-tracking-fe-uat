import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import DefraIdChooseSignInPage from '../page-objects/defra-id-choose-sign-in.page.js'
import DefraIdGovtGatewayPage from '../page-objects/defra-id-govt-gateway.page.js'
import DefraIdGovUKPage from '../page-objects/defra-id-gov-uk.page.js'
import { getValueFromPool } from '@wdio/shared-store-service'

Given(
  'user proceeds to login using a Government Gateway account',
  async function () {
    await HomePage.click(HomePage.startNowButton)
    await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
      process.env.ENVIRONMENT
    )
    await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
    await DefraIdChooseSignInPage.selectSignInMethod('Government Gateway')
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovtGatewayPage.verifyUserIsOnGovernmentGatewayLoginPage(
      this.testConfig.govtGatewayLoginUrl
    )
  }
)

Given('user proceeds to login using a Gov.uk account', async function () {
  await HomePage.click(HomePage.startNowButton)

  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    process.env.ENVIRONMENT
  )
  await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
  await DefraIdChooseSignInPage.selectSignInMethod('GOV.UK One Login')
  await DefraIdChooseSignInPage.clickContinueButton()
  await DefraIdGovUKPage.verifyUserIsOnGovUKLoginPage(
    this.testConfig.govUKBaseUrl
  )
})

When('user enters their Government user Id and password', async function () {
  if (this.env === 'test') {
    this.govGatewayUser = await getValueFromPool('availableGovGatewayUsers')
    await DefraIdGovtGatewayPage.loginWithGovernmentGateway(
      this.govGatewayUser,
      'Pepsi12345*'
    )
  }
})

Then('they should be logged in successfully', async function () {
  // just a place holder step, might have to introduce a static wait
  // for the defra Id sync process to complete in future
})

When('user enters their Gov.uk email address and password', async function () {
  this.govUKUser = await getValueFromPool('availableGovUKUsers')
  await DefraIdGovUKPage.loginWithGovUK(this.govUKUser, 'Pepsi12345*')
})
