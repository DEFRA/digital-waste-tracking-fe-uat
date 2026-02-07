import { When, Then } from '@wdio/cucumber-framework'
import ManageApiCodePage from '../page-objects/manage-api-code.page.js'

When('user is on the View API Code page', async function () {
  // await ManageApiCodePage.open()
  await ManageApiCodePage.verifyUserIsOnYourApiCodePage()
})

Then(
  'user should see the {string} API Code for the selected business',
  async function (status) {
    const response =
      await this.apis.wasteOrganisationBackendAPI.getAllApiCodesForOrganisation(
        this.organisationId
      )
    expect(response.statusCode).toBe(200)

    for (const apiCode of response.json.apiCodes) {
      await ManageApiCodePage.verifyAPICodeIsDisplayed(
        apiCode.code,
        apiCode.isDisabled ? 'disabled' : 'active'
      )
    }
  }
)
