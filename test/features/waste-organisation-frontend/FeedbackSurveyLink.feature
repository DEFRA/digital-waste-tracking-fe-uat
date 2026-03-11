@issue=DWT-1476
Feature: Feedback Survey link for authenticated users
  As an authenticated user of the waste receiver registration portal
  I want to have access to a feedback survey link on the portal
  So that I can provide feedback about the service

  @env_test @accessibility
  Scenario: Authenticated user should be able to access the feedback form via the feedback link
    Given I am logged in to the waste receiver registration portal using a "Gov UK" account
    And I navigate to any page on the portal
    And I should see a beta banner and a feedback survey link
    When I click on the feedback survey link on the beta banner
    Then the feedback form should open in a new tab

  @env_test @accessibility
  Scenario: Unauthenticated user should be able to access the feedback form via the feedback link
    Given I am not logged in to the waste receiver registration portal
    And I navigate to any page on the portal
    When I click on the feedback survey link on the beta banner
    Then the feedback form should open in a new tab
