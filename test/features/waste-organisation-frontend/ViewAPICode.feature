@issue=DWT-967 @env_dev @env_test
Feature: View API Code
As a waste receiver using the service
I want to view the API code for the selected business
So that I can use it to connect my software to the DWT service.

  @env_dev
  Scenario: Waste receiver logs in for the first time for a selected business and gets a new active API Code
    Given a user is logged in to the waste receiver registration portal
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    # ToDo: When the Team A integration is complete
    # And user should be able to submit movements using this API Code

  @env_test @local
  Scenario: Waste receiver with a pre-existing active API Code logs in via Govt Gateway and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal using a Government Gateway account
    # And I selected a business
    And user selects option to view his api code
    When user is on the View API Code page
    # Then I should see the "active" API Code for the selected business

#   @env_test
#   Scenario: Waste receiver with a pre-existing active API Code logs in via Gov.uk and gets the same active API Code
#     Given I am logged in as a waste receiver using a Gov.uk account
#     And I selected a business
#     And I am on the View API Code page
#     Then I should see the "active" API Code for the selected business is the same as the one they got when they logged in for the first time

# back button
# multiple businesses
# "Report of waste" link in header
# "copy" button