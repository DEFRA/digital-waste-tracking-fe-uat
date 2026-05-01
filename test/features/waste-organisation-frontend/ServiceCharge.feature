@issue=DWT-2155
Feature: Report receipt of waste service charge
  As a waste receiver using the DWT service
  I need to be able to pay the service charge for the service
  So that I can use the service.

  @env_dev @env_test @accessibility
  Scenario: Waste receiver initiates to pay the service charge for the service
    Given a user is logged in to the waste receiver registration portal
    When the user initiates to pay the service charge
    And the user continues to pay the service charge
    And the user allowed to review the service charge details
 
  @env_dev @env_test @accessibility
  Scenario: Waste receiver must be able to cancel payment process after the initiation of paying the service charge
    Given a user is logged in to the waste receiver registration portal
    And the user initiates to pay the service charge
    When user cancels the pay service charge
    And the user should be redirected to "account-home" page
  
  @env_dev @env_test @accessibility
  Scenario: Waste receiver must be able to cancel payment process after reviewing the service charge details
    Given a user is logged in to the waste receiver registration portal
    When the user initiates to pay the service charge
    And the user continues to pay the service charge
    And the user allowed to review the service charge details
    When user cancels the review service charge
    And the user should be redirected to "account-home" page