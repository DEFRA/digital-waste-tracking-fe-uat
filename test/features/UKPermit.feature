@feature=Permitted-waste-receiver
Feature: Permitted waste receiver
  As a user of a waste receiving organisation, 
  And I access the waste receiver registration portal 
  Then I need to indicate whether I am permitted to receive waste in the UK

  @env_dev @env_test @issue=DWT-1366 @accessibility
  Scenario: User indicates that they are permitted to receive waste in the UK
    Given a user is on are you a permitted waste receiver page
    When user selects the "Yes" option to indicate they are a permitted waste receiver
    And user clicks on the "Continue" button
    Then user should be redirected to Defra Id service

  @env_dev @env_test @issue=DWT-1017 @accessibility
  Scenario: User indicates that they are not permitted to receive waste in the UK
    Given a user is on are you a permitted waste receiver page
    When user selects the "No" option to indicate they are not a permitted waste receiver
    And user clicks on the "Continue" button
    Then user should be redirected to "Sorry, you cannot use the service" page

  @env_dev @env_test @issue=DWT-1366 @accessibility
  Scenario: User does not indicate whether they are permitted to receive waste in the UK and clicks on continue
    Given a user is on are you a permitted waste receiver page
    When user clicks on the "Continue" button
    Then user should be presented with an error message as below
      | message            |
      | Select Yes if you operate one or more licensed or permitted waste receiving sites |

# Note: there will be seperate tests defined for feedback link etc. when the tickets get played
