@issue=DWT-1106
Feature: Create Additional API Code
As a waste receiver using the DWT service
I need to be able to get an additional API code for my organisation
So that I can connect more than one system to the Receipt of Waste service.

  @env_dev
  Scenario: Waste receiver should be able to create an additional API code for their organisation
    Given a user is logged in to the waste receiver registration portal
    And user selects option to view his api code
    And user is on the View API Code page
    And user should see the "active" API Code for the selected business
    When user tries to create an additional API code
    Then an additional API code should be created for the organisation
    And display the new API code in the API code list
    # To Do when Team A integration is complete
    # make sure the user is able to use the new API code to submit waste movements
