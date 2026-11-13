import { When, Then } from '@wdio/cucumber-framework'
import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import DefraIdOrgPickerPage from '../page-objects/defra-id-org-picker.page.js'
import PayServiceChargePage from '../page-objects/pay-service-charge.page.js'

When(
  'the user switches to a different business',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    if (!(await MyAccountHomePage.isUserOnMyAccountHomePage())) {
      await MyAccountHomePage.open()
      await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    }
    await MyAccountHomePage.switchToDifferentBusiness()
    await DefraIdOrgPickerPage.verifyUserIsOnOrgPickerPage()
    this.testMemory.selectedOrganisation =
      await DefraIdOrgPickerPage.selectOrganisation(1)
  }
)

Then(
  'user should be redirected to the defra my account page',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await MyAccountHomePage.verifyUserIsOnDefraManageAccountPage()
  }
)

When(
  /^the user navigates to (manage account|report receipt of waste)$/,
  /** @this {import('../types/globals.js').CucumberWorld} */ async function (
    action
  ) {
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    if (action === 'manage account') {
      await MyAccountHomePage.navigateToManageAccountPage()
    } else if (action === 'report receipt of waste') {
      await MyAccountHomePage.navigateToReportReceiptOfWasteOptionsPage()
    }
  }
)

When(
  'the user initiates to pay the service charge',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await MyAccountHomePage.navigateToPayServiceChargePage()
    await PayServiceChargePage.verifyUserIsOnPayServiceChargePage()
  }
)

Then(
  'the account page should reflect that the service charge has been paid',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await MyAccountHomePage.open()
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    const serviceChargeStatus =
      MyAccountHomePage.usersLanguagePreference === 'cy'
        ? `Tâl gwasanaeth\nWedi talu\nTaliad nesaf yn ddyledus ym mis ${this.testMemory.nextPaymentDueDate}.`
        : `Service charge\nPaid\nNext payment due ${this.testMemory.nextPaymentDueDate}.`
    await MyAccountHomePage.verifyServiceChargeStatus(serviceChargeStatus)
  }
)

Then(
  'the account page should reflect that the service charge is pending',
  /** @this {import('../types/globals.js').CucumberWorld} */ async function () {
    await MyAccountHomePage.open()
    await MyAccountHomePage.verifyUserIsOnMyAccountHomePage()
    const endDate = new Date(
      this.testMemory.serviceChargeDueDate ??
        this.testEnv.govPayServiceFreePeriodEnd
    )
    if (new Date() < endDate) {
      const month = endDate.toLocaleDateString('en-GB', { month: 'long' })
      const year = endDate.getFullYear()
      await MyAccountHomePage.verifyServiceChargeStatus(
        `Service charge\nPaid\nNext payment due ${month} ${year}. Pay Now.`
      )
    } else {
      await MyAccountHomePage.verifyServiceChargeStatus(
        `Service charge\nPayment due`
      )
    }
  }
)
