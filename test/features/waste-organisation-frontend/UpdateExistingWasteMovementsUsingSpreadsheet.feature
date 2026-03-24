@issue=DWT-1695
Feature: Update existing waste movements by uploading a spreadsheet containing their WTIDs
As a waste receiver
I want to update previously submitted waste movements by re-uploading a spreadsheet containing their WTIDs
So that I can make corrections or changes after submission.

  @env_dev @accessibility
  Scenario: Waste receiver should be able to select an option to update waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
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

  @env_test
  Scenario: Waste receiver with multiple businesses can update existing waste movements for each selected business
    Given a multi-business user is logged in via "Gov UK"
    And the user successfully updates existing waste movements using a spreadsheet for the selected business
    And all the waste movements should be successfully updated
    When the user switches to a different business
    Then the user should be able to successfully update existing waste movements using a spreadsheet for that business
    And the user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated

  @env_test @issue=DWT-1465
  Scenario: Waste receiver update waste movements by uploading a spreadsheet that has errors
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "Test1-format-errors-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated
    And no waste movements should be created
    And the processed spreadsheet should contain error details

  @env_dev @issue=DWT-1465
  Scenario: Waste receiver update waste movements by uploading a spreadsheet that has errors
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "Test1-format-errors-update-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated
    And no waste movements should be created
    And the processed spreadsheet should contain error details

# ToDo: e2e test for updating waste movements using a spreadsheet can be done only once TeamA 
# completes the api development which can then be used to query waste movements using bulk upload id
