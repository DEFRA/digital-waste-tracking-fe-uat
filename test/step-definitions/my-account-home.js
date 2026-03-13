import { When, Then } from '@wdio/cucumber-framework'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import DefraIdOrgPickerPage from '../page-objects/defra-id-org-picker.page.js'

When('the user switches to a different business', async function () {
  if (!(await MyAccountHomePage.isUserOnMyAccountHomePage())) {
    await MyAccountHomePage.open()
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
  }
  await MyAccountHomePage.switchToDifferentBusiness()
  await DefraIdOrgPickerPage.verifyUserIsOnOrgPickerPage()
  this.selectedOrganisation = await DefraIdOrgPickerPage.selectOrganisation(1)
})

Then(
  'user should be redirected to the defra my account page',
  async function () {
    await MyAccountHomePage.verifyUserIsOnDefraManageAccountPage()
  }
)

When(
  /^the user navigates to (manage account|report receipt of waste)$/,
  async function (action) {
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    if (action === 'manage account') {
      await MyAccountHomePage.navigateToManageAccountPage()
    } else if (action === 'report receipt of waste') {
      await MyAccountHomePage.navigateToReportReceiptOfWasteOptionsPage()
    }
  }
)
