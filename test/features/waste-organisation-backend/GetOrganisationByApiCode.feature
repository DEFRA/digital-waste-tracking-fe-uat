@issue=DWT-967 @env_dev @env_test
Feature: Get organisation by API Code endpoint validation

  Scenario: defraOrganisationId must be correctly returned in the response for a valid and active apiCode
    Given a waste receiving organisation is registered
    When the get-organisation-by-apiCode endpoint is called with apiCode of above organisation
    Then defraOrganisationId of the waste receiving organisation must be correctly returned in the response

  Scenario: defraOrganisationId must not be returned for an invalid apiCode
    When the get-organisation-by-apiCode endpoint is called with a "invalid" apiCode
    Then a not-found response should be returned

  Scenario: defraOrganisationId must not be returned for a disabled apiCode
    Given a waste receiving organisation is registered
    And the apiCode of above organisation is disabled
    When the get-organisation-by-apiCode endpoint is called with a "disabled" apiCode
    Then a not-found response should be returned