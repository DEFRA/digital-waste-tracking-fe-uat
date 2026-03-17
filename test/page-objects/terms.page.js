import { Page } from 'page-objects/page'

class TermsPage extends Page {
  // methods
  open() {
    return super.open('/terms')
  }

  // locators
  get heading() {
    return $('h1')
  }

  get declarationIntro() {
    return $('p.govuk-body-l')
  }

  get declarationListItems() {
    return $$('ul.govuk-list--bullet li')
  }

  async verifyAccessDeclarationInTAndCs() {
    await expect(this.heading).toBeDisplayed()
    await expect(this.heading).toHaveText('Terms')
    await expect(this.declarationIntro).toBeDisplayed()
    await expect(this.declarationIntro).toHaveText(
      'By using this service you confirm:'
    )
    const expectedListItems = [
      'you are authorised to act on behalf of your organisation',
      'the information you have given is complete and correct',
      "you understand your organisation's legal responsibility to provide this information",
      'you understand that giving false or misleading information may be a criminal offence'
    ]
    const listItems = await this.declarationListItems
    for (let i = 0; i < expectedListItems.length; i++) {
      await expect(listItems[i]).toBeDisplayed()
      await expect(listItems[i]).toHaveText(expectedListItems[i])
    }
  }
}

export default new TermsPage()
