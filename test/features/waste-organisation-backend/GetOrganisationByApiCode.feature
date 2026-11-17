@issue=DWT-967
Feature: Get organisation by API Code endpoint validation

  @defra-id-stub @defra-id-real
  Scenario: defraOrganisationId must be correctly returned in the response for a valid and active apiCode
    Given a waste receiving organisation is registered
    And the service charge is not due for the organisation
    When the get-organisation-by-apiCode endpoint is called with apiCode of above organisation
    Then defraOrganisationId of the waste receiving organisation must be correctly returned in the response

  @defra-id-stub @defra-id-real
  Scenario: defraOrganisationId must not be returned for an invalid apiCode
    When the get-organisation-by-apiCode endpoint is called with a "invalid" apiCode
    Then a not-found response should be returned

  @defra-id-stub @defra-id-real
  Scenario: defraOrganisationId must not be returned for a disabled apiCode
    Given a waste receiving organisation is registered
    And the service charge is not due for the organisation
    And the apiCode of above organisation is disabled
    When the get-organisation-by-apiCode endpoint is called with a "disabled" apiCode
    Then a not-found response should be returned
  
  @issue=DR-49 @defra-id-stub @defra-id-real
  Scenario: Appropriate error message must be returned for a user who has not paid their service charge after free service period has ended
    Given a waste receiving organisation is registered
    And the service charge is due for the organisation
    When the get-organisation-by-apiCode endpoint is called with apiCode of above organisation
    Then a payment required error response should be returned