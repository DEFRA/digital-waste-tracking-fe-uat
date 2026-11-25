import { Page } from 'page-objects/page'

class CookiesPage extends Page {
  // methods
  open() {
    return super.open('/cookies')
  }

  // locators
  get cookiesDescription() {
    return $('h1 + p.govuk-body')
  }

  get essentialCookiesHeading() {
    return $('h2.govuk-heading-m')
  }

  get essentialCookiesDescription() {
    return $('h2 + p.govuk-body')
  }

  get essentialCookiesHeadingWithGA() {
    return $('h2.govuk-heading-m:nth-child(6)')
  }

  get essentialCookiesDescriptionWithGA() {
    return $('h2.govuk-heading-m:nth-child(6) + p.govuk-body')
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

  async verifyCookiesInformationIsDisplayed(isGoogleAnalyticsEnabled) {
    await this.verifyPageTitle()
    await this.verifyPageHeading()
    await expect(this.cookiesDescription).toBeDisplayed()
    await expect(this.cookiesDescription).toHaveText(
      'This service puts small files (known as cookies) onto your computer. These cookies are used to make the service work and cannot be turned off.'
    )
    const essentialCookiesHeading = isGoogleAnalyticsEnabled
      ? this.essentialCookiesHeadingWithGA
      : this.essentialCookiesHeading
    const essentialCookiesDescription = isGoogleAnalyticsEnabled
      ? this.essentialCookiesDescriptionWithGA
      : this.essentialCookiesDescription
    await expect(essentialCookiesHeading).toBeDisplayed()
    await expect(essentialCookiesHeading).toHaveText('Essential cookies')
    await expect(essentialCookiesDescription).toBeDisplayed()
    await expect(essentialCookiesDescription).toHaveText(
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
