@issue=DWT-967
Feature: View API Code
As a waste receiver using the service
I want to view the API code for the selected business
So that I can use it to connect my software to the DWT service.

  @env_dev @accessibility
  Scenario: Waste receiver logs in for the first time for a selected business and gets a new active API Code
    Given a user is logged in to the waste receiver registration portal
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    # ToDo: When the Team A integration is complete
    # And user should be able to submit movements using this API Code

  @env_test @accessibility
  Scenario: Waste receiver with a pre-existing active API Code logs in via Govt Gateway and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal using a "Government Gateway" account
    # And I selected a business
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    # ToDo: When the Team A integration is complete
    # And user should be able to submit movements using this API Code

  @env_test
  Scenario: Waste receiver with a pre-existing active API Code logs in via Gov.uk and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    # And I selected a business
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    # ToDo: When the Team A integration is complete
    # And user should be able to submit movements using this API Code

# back button
# multiple businesses
# "Report of waste" link in header
# "copy" button