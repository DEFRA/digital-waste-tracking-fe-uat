@issue=DR-66
Feature: Create a new organisation validation

  @issue=DR-66 @defra-id-stub @defra-id-real
  Scenario: disableAfter must be set to null for a newly registered organisation
    When a waste receiving organisation is registered
    Then disableAfter attribute must be set to null for the organisation
    And next payment period is calculated correctly
