@issue=DWT-1600
Feature: Terms and conditions for authenticated or unauthenticated users
  As an authenticated or unauthenticated user of the RoW service
  I want to access the terms and conditions 
  So that I understand the legal responsibilities associated with using the service. 

  @env_dev @env_test @accessibility
  Scenario: Authenticated Gov UK user should be able to see the Access declaration in T&Cs via the terms link
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user navigates to any page on the portal
    When the user clicks on the "Terms" link in the footer
    Then the user should be able to see the Access declaration in T&Cs

  @env_dev @env_test
  Scenario: Unauthenticated user should be able to see the Access declaration in T&Cs via the terms link
    Given a user is not logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the "Terms" link in the footer
    Then the user should be able to see the Access declaration in T&Cs

  @env_dev
  Scenario: Authenticated Defra ID user should be able to see the Access declaration in T&Cs via the terms link
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to any page on the portal
    When the user clicks on the "Terms" link in the footer
    Then the user should be able to see the Access declaration in T&Cs
