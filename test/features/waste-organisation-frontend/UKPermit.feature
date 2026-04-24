@issue=DWT-2283
Feature: Permitted waste receiver and not LA
  As a user of a waste receiving organisation,
  I access the waste receiver registration portal
  I need to indicate whether I am permitted to receive waste in the UK

  @env_dev @env_test @accessibility
  Scenario: User indicates that they are not a local authority
    Given a user is on are you a local authority page
    When user selects the "No" option to indicate they are not a local authority
    And user clicks on the "Continue" button
    Then user should be redirected to Defra Id service

  @env_dev @env_test @accessibility
  Scenario: User indicates that they are a local authority
    Given a user is on are you a local authority page
    When user selects the "Yes" option to indicate they are a local authority
    And user clicks on the "Continue" button
    Then user should be redirected to "Sorry, you cannot use the service" page

  @env_dev @env_test @issue=DWT-1366 @accessibility
  Scenario: User does not indicate whether they are a local authority and clicks on continue
    Given a user is on are you a local authority page
    When user clicks on the "Continue" button
    Then user should be presented with an error message as below
      | message                                                |
      | Select Yes if you are registering as a local authority |

  @env_test @env_dev @issue=DWT-1990
  Scenario: Once user is logged in, he should not be asked to indicate whether they are a local authority
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    When user navigates to are you a permitted waste receiver page
    Then user should be redirected to "account-home" page
# Note: there will be seperate tests defined for feedback link etc. when the tickets get played
