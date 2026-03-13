import { When } from '@cucumber/cucumber'
import { getRandomPage } from '../utils/page'

When('the user navigates to any page on the portal', async function () {
  this.currentPage = await getRandomPage()
  await this.currentPage.open()
})
