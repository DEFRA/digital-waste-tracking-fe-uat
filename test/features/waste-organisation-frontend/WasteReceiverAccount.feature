@issue=DWT-1502,DWT-1505
Feature: Waste receiving account page
    As a signed in user
    I want to see the organisation that I am currently acting on behalf of and the actions available to me
    So that I can manage my account and complete tasks for that organisation.

  @env_test
  Scenario: User should be able to switch to a different organisation using the switch organisation button
    Given a user is associated with multiple businesses
    And a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user has selected a business that he wants to act on behalf of
    And the user should be redirected to "account-home" page of that business
    When the user switches to a different business
    Then the user should be redirected to "account-home" page of that new business

  @env_test
  Scenario: User should be able to redirected to defra my account page when they click on the manage account button
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    When the user navigates to manage account
    Then user should be redirected to the defra my account page

  @env_test
  Scenario: User should be able to click on report receipt of waste and displayed with list of actions to choose from
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    When the user navigates to report receipt of waste
    Then the user should be redirected to "Report receipt of waste" page
