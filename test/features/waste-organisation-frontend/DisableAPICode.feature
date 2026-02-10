@issue=DWT-886
Feature: Disable API Code
As a waste receiver using the service
I need to be able to disable an API code for my organisation
So that I can prevent that API code from being used to access the DWT service.

  @env_dev
  Scenario: Waste receiver should be able to disable an API code for their organisation
    Given a user is logged in to the waste receiver registration portal
    And user selects option to view his api code
    And user is on the View API Code page
    And user should see the "active" API Code for the selected business
    When user tries to disable an active API Code
    And user should be redirected to "Confirm disable API code" page
    And user selects the "Yes" option to disabling the API Code
    Then the API code should be disabled
    # # ToDo: When the Team A integration is complete
    # # And user should not be able to submit movements using this API Code

  @env_dev
  Scenario: Waste receiver should be able to select "No" on disable API code confirmation page
    Given a user is logged in to the waste receiver registration portal
    And user selects option to view his api code
    And user is on the View API Code page
    And user should see the "active" API Code for the selected business
    When user tries to disable an active API Code
    And user should be redirected to "Confirm disable API code" page
    And user selects the "No" option to disabling the API Code
    Then the API code should not be disabled
    # # ToDo: When the Team A integration is complete
    # # And user should still be able to submit movements using this API Code

# # back button
# "Report of waste" link in header
