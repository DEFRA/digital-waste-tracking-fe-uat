@issue=DWT-1695
Feature: Update existing waste movements by uploading a spreadsheet containing their WTIDs
As a waste receiver
I want to update previously submitted waste movements by re-uploading a spreadsheet containing their WTIDs
So that I can make corrections or changes after submission.

  @env_dev @accessibility
  Scenario: Waste receiver should be able to select an option to update waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-update-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated
    # And email should sent to the user with the spreadsheet and WTIDs

  @env_test @accessibility
  Scenario Outline: Waste receiver should be able to login via "<account_type>" and upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal using a "<account_type>" account
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-update-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated
    # And email should sent to the user with the spreadsheet and WTIDs

    Examples:
      | account_type       |
      | Gov UK             |
      | Government Gateway |

  Scenario: Waste receiver with multiple businessess should be able to switch between businesses and update existing waste movements using a spreadsheet

# ToDo: e2e test for updating waste movements using a spreadsheet can be done only once TeamA 
# completes the api development which can then be used to query waste movements using bulk upload id
