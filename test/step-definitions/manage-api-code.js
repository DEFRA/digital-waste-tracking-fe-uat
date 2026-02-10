import { When, Then } from '@wdio/cucumber-framework'
import ManageApiCodePage from '../page-objects/manage-api-code.page.js'
import ConfirmDisableApiCodePage from '../page-objects/confirm-disable-api-code.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'

When('user is on the View API Code page', async function () {
  // await ManageApiCodePage.open()
  await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
  this.pageName = 'view-api-code-with-active-codes-page'
  await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
})

Then(
  'user should see the {string} API Code for the selected business',
  async function (status) {
    if (this.env.ENVIRONMENT === 'dev') {
      const response =
        await this.apis.wasteOrganisationBackendAPI.getAllApiCodesForOrganisation(
          this.organisationId
        )
      expect(response.statusCode).toBe(200)

      let activeApiCode = ''
      for (const apiCode of response.json.apiCodes) {
        await ManageApiCodePage.verifyAPICodeIsDisplayed(
          apiCode.code,
          apiCode.isDisabled ? 'disabled' : 'active'
        )
        if (apiCode.isDisabled === false) {
          activeApiCode = apiCode.code
        }
      }
      this.activeApiCode = activeApiCode
    } else {
      await ManageApiCodePage.verifyAPICodeIsDisplayed('', status)
      const activeApiCode = await ManageApiCodePage.getListOfActiveAPICodes()
      this.activeApiCode = activeApiCode[0]
    }
  }
)

When('user tries to disable an active API Code', async function () {
  await ManageApiCodePage.clickDisableButtonForAPICode(this.activeApiCode)
})

When(
  'user should be redirected to "Confirm disable API code" page',
  async function () {
    await ConfirmDisableApiCodePage.verifyUserIsOnConfirmDisableApiCodePage(
      this.activeApiCode
    )
    this.pageName = 'confirm-disable-api-code-page'
    await analyseAccessibility(this.tags, this.axeBuilder, this.pageName)
  }
)

When(
  'user selects the {string} option to disabling the API Code',
  async function (option) {
    if (option === 'Yes') {
      await ConfirmDisableApiCodePage.userContinuesWithDisableApiCodeAction(
        this.activeApiCode
      )
    } else {
      await ConfirmDisableApiCodePage.userDoesNotContinueWithDisableApiCodeAction(
        this.activeApiCode
      )
    }
  }
)

Then(
  /^the API code should (be disabled|not be disabled)$/,
  async function (status) {
    await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
    this.pageName = 'view-api-code-with-active-codes-page'
    if (status.includes('not')) {
      await ManageApiCodePage.verifyAPICodeIsDisplayed(
        this.activeApiCode,
        'active'
      )
    } else {
      await ManageApiCodePage.verifyAPICodeIsDisplayed(
        this.activeApiCode,
        'disabled'
      )
      await ManageApiCodePage.verifyDisableApiCodeNotificationBannerIsDisplayed(
        this.activeApiCode
      )
    }
  }
)

Then('display the new API code in the API code list', async function () {
  await ManageApiCodePage.verifyAdditionalAPICodeIsCreated(this.activeAPICodes)
})

Then('an additional API code should be created for the organisation', () => {
  // just added this for completeness, but does nothing
})

When('user tries to create an additional API code', async function () {
  this.activeAPICodes = await ManageApiCodePage.getListOfActiveAPICodes()
  await ManageApiCodePage.userCreatesAnAdditionalAPICode()
})
