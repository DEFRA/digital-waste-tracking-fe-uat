@issue=DWT-1027 @browserstack
Feature: User Journeys - BrowserStack
  As a waste receiver using the DWT service
  I need to be able to log in to the DWT service and view my API code
  So that I can use it to connect my software to the DWT service and submit waste movements.

  Scenario: compatibility - Waste receiver with a pre-existing active API Code logs in and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    And the user signs out of his existing session

  Scenario: compatibility - Waste recevier should be able to create an additional API code
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to view his api code
    And user is on the View API Code page
    And user should see the "active" API Code for the selected business
    When user tries to create an additional API code
    Then an additional API code should be created for the organisation
    And display the new API code in the API code list
    And the user signs out of his existing session
  