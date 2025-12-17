import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import DefraIdChooseSignInPage from '../page-objects/defra-id-choose-sign-in.page.js'
import DefraIdGovtGatewayPage from '../page-objects/defra-id-govt-gateway.page.js'

Given(
  'user proceeds to login using a Government Gateway account',
  async function () {
    await HomePage.click(HomePage.startNowButton)
    await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
      process.env.ENVIRONMENT
    )
    await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
    await DefraIdChooseSignInPage.selectSignInMethod(
      DefraIdChooseSignInPage.govGatewayRadio,
      'Government Gateway'
    )
    await DefraIdChooseSignInPage.clickContinueButton()
    await DefraIdGovtGatewayPage.verifyUserIsOnGovernmentGatewayLoginPage()
  }
)

Given('user proceeds to login using a Gov.uk account', async function () {
  await HomePage.click(HomePage.startNowButton)
  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    process.env.ENVIRONMENT
  )
  await DefraIdChooseSignInPage.verifyUserIsOnDefraIdChooseSignInPage()
  await DefraIdChooseSignInPage.selectSignInMethod(
    DefraIdChooseSignInPage.govUKOneLoginRadio,
    'GOV.UK One Login'
  )
  await DefraIdChooseSignInPage.clickContinueButton()
  // To Do: Verify user is on the login using Gov.uk page
})

When('user enters their Government user Id and password', async function () {
  // ToDo : parameterize the user id and password
  await DefraIdGovtGatewayPage.loginWithGovernmentGateway(
    '520924829145',
    'Pepsi12345*'
  )
})

Then('they should be logged in successfully', async function () {
  // just a place holder step, might have to introduce a static wait
  // for the defra Id sync process to complete in future
  await expect(await this.getUrl()).toBe(
    'https://waste-organisation-frontend.dev.cdp-int.defra.cloud/waste-organisation-frontend/waste-organisation-registration/waste-organisation-registration/is-your-organisation-a-waste-receiver'
  )
})
