@issue=DWT-1695
Feature: Update existing waste movements by uploading a spreadsheet containing their WTIDs
As a waste receiver
I want to update previously submitted waste movements by re-uploading a spreadsheet containing their WTIDs
So that I can make corrections or changes after submission.

  @env_dev @accessibility
  Scenario: Waste receiver should be able to select an option to update waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    And user selects copy of a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    And the user should be redirected to "Upload successful" page
    And all the waste movements should be successfully created
    And the processed spreadsheet should contain valid WTIDs
    And the user navigates directly to report receipt of waste page on the portal
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-update-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated
    And the processed spreadsheet should contain valid WTIDs
    # And email should sent to the user with the spreadsheet and WTIDs

  @env_test @accessibility
  Scenario Outline: Waste receiver should be able to login via "<account_type>" and upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal using a "<account_type>" account
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    And user selects copy of a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    And the user should be redirected to "Upload successful" page
    And all the waste movements should be successfully created
    And the processed spreadsheet should contain valid WTIDs
    And the user navigates directly to report receipt of waste page on the portal
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-update-spreadsheet.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And all the waste movements should be successfully updated
    And the processed spreadsheet should contain valid WTIDs
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
  Scenario Outline: Waste receiver update waste movements by uploading a spreadsheet that has "<error_type>" errors
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "<spreadsheet_file>" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And no waste movements should be created
    And the processed spreadsheet should contain error details

    Examples:
      |error_type| spreadsheet_file                            |
      | format   | Test1-update-format-errors-spreadsheet.xlsx |
      | api      | Test1-update-api-errors-spreadsheet.xlsx    |

  @env_dev @issue=DWT-1465
  Scenario Outline: Waste receiver update waste movements by uploading a spreadsheet that has "<error_type>" errors
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "<spreadsheet_file>" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And no waste movements should be created
    And the processed spreadsheet should contain error details

    Examples:
      |error_type| spreadsheet_file                            |
      | format   | Test1-update-format-errors-spreadsheet.xlsx |
      | api      | Test1-update-api-errors-spreadsheet.xlsx    |
      
  @env_dev @issue=DWT-1431,DWT-1641
  Scenario Outline: Waste receiver update waste movements by uploading an unsupported file type "<file_type>"
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "<file_type>" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And no waste movements should be created
    And the spreadsheet must be rejected

    Examples:
      | file_type                    |
      | Unsupported-file-type-1.png  |
      | Unsupported-file-type-2.xlsm |
# ToDo: e2e test for updating waste movements using a spreadsheet can be done only once TeamA 
# completes the api development which can then be used to query waste movements using bulk upload id
