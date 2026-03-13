import MyAccountHomePage from '../page-objects/my-account-home.page.js'
import NextActionPage from '../page-objects/next-action.page.js'
import manageApiCodePage from '../page-objects/manage-api-code.page.js'

export async function getRandomPage() {
  const pages = [MyAccountHomePage, NextActionPage, manageApiCodePage]
  const randomIndex = Math.floor(Math.random() * pages.length)
  return pages[randomIndex]
}
