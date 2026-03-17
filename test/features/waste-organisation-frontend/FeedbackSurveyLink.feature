@issue=DWT-1476
Feature: Feedback Survey link for authenticated or unauthenticated users
  As an authenticated or unauthenticated user of the waste receiver registration portal
  I want to have access to a feedback survey link on the portal
  So that I can provide feedback about the service

  @env_test @accessibility
  Scenario: Authenticated Gov UK user should be able to access the feedback form via the feedback link
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user navigates to any page on the portal
    And the user should see a beta banner and a feedback survey link
    When the user clicks on the feedback survey link on the beta banner
    Then the feedback form should open in a new tab

  @env_dev @env_test
  Scenario: Unauthenticated user should be able to access the feedback form via the feedback link
    Given a user is not logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the feedback survey link on the beta banner
    Then the feedback form should open in a new tab

  @env_dev
  Scenario: Authenticated Defra ID user should be able to access the feedback form via the feedback link
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    And the user should see a beta banner and a feedback survey link
    When the user clicks on the feedback survey link on the beta banner
    Then the feedback form should open in a new tab
