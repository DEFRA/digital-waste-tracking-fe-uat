import { When, Then, Given } from '@wdio/cucumber-framework'
import ManageApiCodePage from '../page-objects/manage-api-code.page.js'
import ConfirmDisableApiCodePage from '../page-objects/confirm-disable-api-code.page.js'
import { analyseAccessibility } from '../utils/accessibility-checking.js'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import NextActionPage from '../page-objects/next-action.page.js'
import ChangeApiCodeNamePage from '../page-objects/change-api-code-name.page.js'

async function navigateToApiCodePage(context) {
  await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  await MyAccountHomePage.navigateToReportReceiptOfWasteOptionsPage()
  await NextActionPage.selectNextAction('connectYourSoftware')
  await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
  const activeAPICodes = await ManageApiCodePage.getListOfActiveAPICodes()
  context.testMemory.activeApiCode = activeAPICodes[0]
  return context.testMemory.activeApiCode
}

Given(
  'the user views the API code for the selected business',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await navigateToApiCodePage(this)
  }
)

Then(
  'the user should see a different {string} API code for that business',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    status
  ) {
    const previousApiCode = this.testMemory.activeApiCode
    const newApiCode = await navigateToApiCodePage(this)
    await ManageApiCodePage.verifyAPICodeIsDisplayed(newApiCode, status)
    expect(newApiCode).not.toBe(previousApiCode)
    this.testMemory.activeApiCode = newApiCode
  }
)

When(
  'user is on the View API Code page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
    this.testMemory.pageName = 'view-api-code-with-active-codes-page'
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
  }
)

Given(
  'the organisation is returned as a local authority for that API code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    // // ToDo: Commented out for now as this step def does not work in the test env.
    // // This is complicated further by there being a Auto Test Receiver 1 & 2
    // // 2 is used in the test env, and 1 is used in the dev env.
    // //
    // const response =
    //   await this.testMemory.apis.wasteOrganisationBackendAPI.getOrganisationByApiCode(
    //     this.testMemory.activeApiCode
    //   )
    // expect(response.statusCode).toBe(200)
    // expect(response.json.name).toBe(this.testMemory.organisationName)
    // expect(response.json.isLocalAuthority).toBe(true)
    // expect(response.json.defraCustomerOrganisationId).toEqual(
    //   expect.any(String)
    // )
    // expect(response.json.defraCustomerOrganisationId).toBe(this.testMemory.organisationId)
  }
)

Then(
  'user should see the {string} API Code for the selected business',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    status
  ) {
    if (
      this.testEnv.environment === 'dev' ||
      this.testEnv.environment === 'perf-test'
    ) {
      const response =
        await this.testMemory.apis.wasteOrganisationBackendAPI.getAllApiCodesForOrganisation(
          this.testMemory.organisationId
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
      this.testMemory.activeApiCode = activeApiCode
    } else {
      await ManageApiCodePage.verifyAPICodeIsDisplayed('', status)
      this.testMemory.activeAPICodes =
        await ManageApiCodePage.getListOfActiveAPICodes()
      this.testMemory.activeApiCode = this.testMemory.activeAPICodes[0]
    }
  }
)

When(
  'user tries to disable an active API Code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.clickDisableButtonForAPICode(
      this.testMemory.activeApiCode
    )
  }
)

When(
  'user selects the {string} option to disabling the API Code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    option
  ) {
    if (option === 'Yes') {
      await ConfirmDisableApiCodePage.userContinuesWithDisableApiCodeAction(
        this.testMemory.activeApiCode
      )
    } else {
      await ConfirmDisableApiCodePage.userDoesNotContinueWithDisableApiCodeAction(
        this.testMemory.activeApiCode
      )
    }
  }
)

Then(
  /^the API code should (be disabled|not be disabled)$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    status
  ) {
    await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
    this.testMemory.pageName = 'view-api-code-with-active-codes-page'
    if (status.includes('not')) {
      await ManageApiCodePage.verifyAPICodeIsDisplayed(
        this.testMemory.activeApiCode,
        'active'
      )
    } else {
      await ManageApiCodePage.verifyAPICodeIsDisplayed(
        this.testMemory.activeApiCode,
        'disabled'
      )
      await ManageApiCodePage.verifyDisableApiCodeNotificationBannerIsDisplayed(
        this.testMemory.activeApiCode
      )
      this.testMemory.disabledApiCode = this.testMemory.activeApiCode
    }
  }
)

Then(
  'display the new API code in the API code list',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.activeApiCode =
      await ManageApiCodePage.verifyAdditionalAPICodeIsCreated(
        this.testMemory.activeAPICodes
      )
  }
)

Then('an additional API code should be created for the organisation', () => {
  // just added this for completeness, but does nothing
})

When(
  'user tries to create an additional API code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.activeAPICodes =
      await ManageApiCodePage.getListOfActiveAPICodes()
    await ManageApiCodePage.userCreatesAnAdditionalAPICode()
  }
)

Given(
  'user disables all existing API codes',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    const activeApiCode = await ManageApiCodePage.getListOfActiveAPICodes()
    for (const apiCode of activeApiCode) {
      const response =
        await this.testMemory.apis.wasteOrganisationBackendAPI.disableApiCodeForOrganisation(
          this.testMemory.organisationId,
          apiCode
        )
      expect(response.statusCode).toBe(200)
    }
    this.testMemory.activeAPICodes = []
  }
)

When(
  'user tries to create new API code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.pageName = 'view-api-code-with-all-codes-disabled-page'
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
    await ManageApiCodePage.userCreatesANewAPICode()
  }
)

Then(
  'the API code should display the updated name in the API code list',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
    await ManageApiCodePage.verifyAPICodeIsDisplayed(
      this.testMemory.activeApiCode,
      'active'
    )
    await ManageApiCodePage.verifyAPICodeNameIsDisplayedInTheApiCodeList(
      this.testMemory.activeApiCode,
      this.testMemory.newApiCodeName
    )
  }
)

When(
  'the user gives the API code a meaningful name',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    this.testMemory.newApiCodeName = 'Test API Code'
    await ManageApiCodePage.userClicksOnChangeNameButtonForAPICode(
      this.testMemory.activeApiCode
    )
    await ChangeApiCodeNamePage.verifyUserIsOnChangeApiCodeNamePage(
      this.testMemory.activeApiCode
    )
    this.testMemory.pageName = 'change-api-code-name-page'
    await analyseAccessibility(
      this.testMemory.tags,
      this.testMemory.axeBuilder,
      this.testMemory.pageName
    )
    await ChangeApiCodeNamePage.userChangesTheApiCodeName(
      this.testMemory.newApiCodeName
    )
  }
)

When(
  'user has disabled the active API Code',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.clickDisableButtonForAPICode(
      this.testMemory.activeApiCode
    )
    await ConfirmDisableApiCodePage.userContinuesWithDisableApiCodeAction(
      this.testMemory.activeApiCode
    )
    await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
    await ManageApiCodePage.verifyAPICodeIsDisplayed(
      this.testMemory.activeApiCode,
      'disabled'
    )
    await ManageApiCodePage.verifyDisableApiCodeNotificationBannerIsDisplayed(
      this.testMemory.activeApiCode
    )
    this.testMemory.disabledApiCode = this.testMemory.activeApiCode
  }
)

Then(
  'the new name of the api code must be displayed in the disabled api code list',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.verifyAPICodeNameIsDisplayedInTheDisabledApiCodeList(
      this.testMemory.disabledApiCode,
      this.testMemory.newApiCodeName
    )
  }
)

When(
  'user copies the api code to the clipboard',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.clickCopyButtonForAPICode(
      this.testMemory.activeApiCode
    )
  }
)

When(
  'the api code should be copied to the clipboard',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await ManageApiCodePage.verifyAPICodeIsCopiedToClipboard(
      this.testMemory.activeApiCode
    )
  }
)
