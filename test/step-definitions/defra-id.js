import { Given, When, Then } from '@wdio/cucumber-framework'
import HomePage from '../page-objects/home.page.js'
import DefraId from '../page-objects/defra-id.page.js'

Given(
  'user proceeds to login using a Government Gateway account',
  async function () {
    await HomePage.click(HomePage.startNowButton)
    await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
      process.env.ENVIRONMENT
    )
    await DefraId.verifyUserIsOnDefraIdChooseSignInPage()
    await DefraId.selectSignInMethod(
      DefraId.govGatewayRadio,
      'Government Gateway'
    )
    // await DefraId.click(DefraId.continueButton)
  }
)

Given('user proceeds to login using a Gov.uk account', async function () {
  await HomePage.click(HomePage.startNowButton)
  await HomePage.verifyUserNavigatedCorrectlyToDefraIdService(
    process.env.ENVIRONMENT
  )
  await DefraId.verifyUserIsOnDefraIdChooseSignInPage()
  await DefraId.selectSignInMethod(
    DefraId.govUKOneLoginRadio,
    'GOV.UK One Login'
  )
  // await DefraId.click(DefraId.continueButton)
})

When('user enters their Government user Id and password', async function () {
  // ToDo : parameterize the user id and password
  await DefraId.enterText(DefraId.govGatewayUserIdInput, '520924829145')
  await DefraId.enterText(DefraId.govGatewayPasswordInput, 'Pepsi12345*')
  await DefraId.click(DefraId.govGatewayContinueButton)
})

Then('they should be logged in successfully', async function () {})
