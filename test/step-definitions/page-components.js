import { Then, When } from '@cucumber/cucumber'

Then(
  'I should see a beta banner and a feedback survey link',
  async function () {
    await this.currentPage.verifyBetaBannerIsDisplayed()
    await this.currentPage.verifyFeedbackLinkIsDisplayed()
  }
)

When(
  'I click on the feedback survey link on the beta banner',
  async function () {
    await this.currentPage.clickFeedbackLink()
  }
)

Then('the feedback form should open in a new tab', async function () {
  await this.currentPage.verifyFeedbackFormOpenedInNewTab()
})
