@issue=DWT-1027 @browserstack
Feature: User Journeys - BrowserStack
  As a waste receiver using the DWT service
  I need to be able to log in to the DWT service and view my API code
  So that I can use it to connect my software to the DWT service. BrowserStack

  Scenario: GovUK - Waste receiver with a pre-existing active API Code logs in via Gov.uk and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    # And I selected a business
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
  # ToDo: When the Team A integration is complete
  # And user should be able to submit movements using this API Code

  Scenario: GovUK - Waste recevier should be able to create an additional API code
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    # And I selected a business
    And user selects option to view his api code
    And user is on the View API Code page
    And user should see the "active" API Code for the selected business
    When user tries to create an additional API code
    Then an additional API code should be created for the organisation
    And display the new API code in the API code list

# Scenario: GovUK - Waste receiver should be able to disable an API code for their organisation
#   Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
#   And user selects option to view his api code
#   And user is on the View API Code page
#   And user should see the "active" API Code for the selected business
#   When user tries to disable an active API Code
#   And user should be redirected to "Confirm disable API code" page
#   And user selects the "Yes" option to disabling the API Code
#   Then the API code should be disabled
