import { Page } from 'page-objects/page'

class CookiesPage extends Page {
  // methods
  open() {
    return super.open('/cookies')
  }

  // locators
  get heading() {
    return $('h1')
  }

  get cookiesDescription() {
    return $('h1 + p.govuk-body')
  }

  get essentialCookiesHeading() {
    return $('h2.govuk-heading-m')
  }

  get essentialCookiesDescription() {
    return $('h2 + p.govuk-body')
  }

  get cookiesTable() {
    return $('table.govuk-table')
  }

  get cookiesTableHeaders() {
    return this.cookiesTable.$$('thead th')
  }

  get cookiesTableRows() {
    return this.cookiesTable.$$('tbody tr')
  }

  async verifyCookiesInformationIsDisplayed() {
    await this.verifyPageTitle('Cookies | Report receipt of waste')
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Cookies')
    await expect(this.cookiesDescription).toBeDisplayed()
    await expect(this.cookiesDescription).toHaveText(
      'This service puts small files (known as cookies) onto your computer. These cookies are used to make the service work and cannot be turned off.'
    )
    await expect(this.essentialCookiesHeading).toBeDisplayed()
    await expect(this.essentialCookiesHeading).toHaveText('Essential cookies')
    await expect(this.essentialCookiesDescription).toBeDisplayed()
    await expect(this.essentialCookiesDescription).toHaveText(
      'Essential cookies keep your information secure while you use this service. We do not need to ask permission to use them.'
    )
    await expect(this.cookiesTable).toBeDisplayed()
    const expectedTableHeaders = ['Name', 'Purpose', 'Expires']
    const tableHeaders = await this.cookiesTableHeaders
    for (let i = 0; i < expectedTableHeaders.length; i++) {
      await expect(tableHeaders[i]).toBeDisplayed()
      await expect(tableHeaders[i]).toHaveText(expectedTableHeaders[i])
    }
    const expectedTableData = [
      ['userSession', 'Keeps you signed in', '4 hours'],
      ['session', 'Stores session data', '4 hours'],
      [
        'bell-defraId',
        'Used to sign in with Defra ID',
        'When you close your browser'
      ]
    ]
    const tableRows = await this.cookiesTableRows
    for (let i = 0; i < expectedTableData.length; i++) {
      const tableData = await tableRows[i].$$('td')
      for (let j = 0; j < expectedTableData[i].length; j++) {
        await expect(tableData[j]).toBeDisplayed()
        await expect(tableData[j]).toHaveText(expectedTableData[i][j])
      }
    }
  }
}

export default new CookiesPage()
