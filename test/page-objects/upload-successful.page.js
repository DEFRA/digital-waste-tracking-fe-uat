import { Page } from 'page-objects/page'
import { browser, $ } from '@wdio/globals'

class UploadSuccessfulPage extends Page {
  // locators
  get heading() {
    return $('h1')
  }

  async verifyUserIsOnUploadSuccessfulPage(mode = 'upload') {
    await expect(browser).toHaveUrl(
      mode === 'upload'
        ? /\/organisation\/[a-zA-Z0-9-]+\/spreadsheet\/file-uploaded/
        : /\/organisation\/[a-zA-Z0-9-]+\/update-spreadsheet\/file-uploaded/
    )
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText(
      mode === 'upload'
        ? 'Spreadsheet upload successful'
        : 'Spreadsheet update successful'
    )
    const url = await browser.getUrl()
    const match = url.match(
      mode === 'upload'
        ? /\/organisation\/([a-zA-Z0-9-]+)\/spreadsheet\/file-uploaded/
        : /\/organisation\/([a-zA-Z0-9-]+)\/update-spreadsheet\/file-uploaded/
    )
    return match ? match[1] : null
  }
}

export default new UploadSuccessfulPage()
