@issue=DWT-1027 @env_ext-test @smoke @browserstack
Feature: User Journeys
  As a waste receiver using the DWT service
  I need to be able to log in to the DWT service and view my API code
  So that I can use it to connect my software to the DWT service and submit waste movements.

  @env_local
  Scenario: Waste receiver with a pre-existing active API Code logs in and gets the same active API Code
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to view his api code
    When user is on the View API Code page
    Then user should see the "active" API Code for the selected business
    And the user signs out of his existing session

  @env_local
  Scenario: Waste recevier should be able to create an additional API code
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to view his api code
    And user is on the View API Code page
    And user should see the "active" API Code for the selected business
    When user tries to create an additional API code
    Then an additional API code should be created for the organisation
    And display the new API code in the API code list
    And the user signs out of his existing session

  @env_local
  Scenario: Waste receiver should be able to upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    Then the user should be redirected to "Upload successful" page

  @env_local
  Scenario: Waste receiver should be able to update waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-update-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page  

   Scenario Outline: Waste receiver must not be able to pay service charge for an organisation with a card "<reason>" "<card_number>"
    Given a user is logged in to the waste receiver registration portal
    When the service charge is due
    And user pays the service charge using "<card_brand>" "<card_type>" card "<card_number>"
    Then the payment should be "unsuccessful"
    And the user should see an error message "<expected error message>"
    And the account page should reflect that the service charge is pending

    Examples:
      | card_brand | card_type | card_number      | reason                      | expected error message                             |
      | Visa       | Credit    | 4000000000000069 | that is expired             | There was a problem with your payment - GOV.UK Pay |
