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
    And user should be able to use the new API code to submit waste movements

  @env_test @accessibility
  Scenario Outline: Waste receiver with a pre-existing active API Code logs in via "<account_type>" and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal using a "<account_type>" account
    # And I selected a business
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    And user should be able to use the new API code to submit waste movements

    Examples:
      | account_type       |
      | Gov UK             |
      | Government Gateway |

  Scenario: Waste receiver with multiple businessess should be able to switch between businesses and view their API codes

# back button
# "Report of waste" link in header
# "copy" button
