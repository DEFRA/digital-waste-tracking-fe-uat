import { When } from '@cucumber/cucumber'
import { getRandomPage } from '../utils/page'

When('I navigate to any page on the portal', async function () {
  this.currentPage = await getRandomPage()
  await this.currentPage.open()
})
