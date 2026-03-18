@issue=DWT-1610
Feature: Access cookies information for authenticated or unauthenticated users
  As an authenticated or unauthenticated user of the RoW service
  I want to access information about cookies used by the RoW service
  So that I can understand how cookies are used.

  @env_test @accessibility
  Scenario: Authenticated Gov UK user should be able to see the Access cookies information via the cookies link
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user navigates to any page on the portal
    When the user clicks on the "Cookies" link in the footer
    Then the user should be able to see information about how cookies are used

  @env_dev @env_test
  Scenario: Unauthenticated user should be able to see the Access cookies information via the cookies link
    Given a user is not logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the "Cookies" link in the footer
    Then the user should be able to see information about how cookies are used

  @env_dev
  Scenario: Authenticated Defra ID user should be able to see the Access cookies information via the cookies link
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the "Cookies" link in the footer
    Then the user should be able to see information about how cookies are used
