@issue=DWT-1437
Feature: Access the privacy notice (Private Beta)
  As a user of the RoW service
  I want to access the privacy notice in the RoW service
  So that I can understand how my personal data is used.

  @env_dev @env_test
  Scenario: Unauthenticated user should be able to see the Privacy Notice via the Privacy footer link
    Given a user is not logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the "Privacy" link in the footer
    And the user should be redirected to "privacy-notice" page
    # Then the user should be able to see information on how their personal data is used

  @env_dev @env_test @accessibility
  Scenario: Authenticated Defra ID user should be able to see the Access cookies information via the cookies link
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the "Privacy" link in the footer
    And the user should be redirected to "privacy-notice" page
