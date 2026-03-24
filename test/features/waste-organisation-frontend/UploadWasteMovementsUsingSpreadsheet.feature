@issue=DWT-1689
Feature: Upload Waste Movements Using Spreadsheet
As a waste receiver
I want to upload a spreadsheet containing waste movement data for my selected organisation
So that I can submit waste movement data, correctly linked to the business I have selected 

  @env_dev @accessibility
  Scenario: Waste receiver should be able to upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    Then the user should be redirected to "Upload successful" page
    And all the waste movements should be successfully created
    And the processed spreadsheet should contain valid WTIDs
    # And email should sent to the user with the spreadsheet and WTIDs

  @env_test @accessibility
  Scenario Outline: Waste receiver should be able to login via "<account_type>" and upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal using a "<account_type>" account
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    Then the user should be redirected to "Upload successful" page
    And all the waste movements should be successfully created
    # And email should sent to the user with the spreadsheet and WTIDs

    Examples:
      | account_type       |
      | Gov UK             |
      | Government Gateway |

  @env_test
  Scenario: Waste receiver with multiple businesses can upload waste movements for each selected business
    Given a multi-business user is logged in via "Gov UK"
    And the user successfully uploads a waste movement spreadsheet for the selected business
    And all the waste movements should be successfully created
    When the user switches to a different business
    Then the user should be able to successfully upload a waste movement spreadsheet for that business
    And all the waste movements should be successfully created

  @env_dev @issue=DWT-1465
  Scenario Outline: Waste receiver uploads a spreadsheet that fails with "<error_type>" errors
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "<spreadsheet_file>" to upload
    Then the user should be redirected to "Upload successful" page
    And no waste movements should be created
    And the processed spreadsheet should contain error details

    Examples:
      | error_type     | spreadsheet_file                     |
      | format         | Test1-format-errors-spreadsheet.xlsx |
      | api validation | Test1-api-errors-spreadsheet.xlsx    |
      
# to implement below scenario
# user should not be able to continue without uploading a spreadsheet
# spreadsheet error upload scenarios
# format errors 
#  - missing waste items 
#  - missing waste movement id for waste items
#  - waste tracking ids present in upload 
#  - invalid format for ewc codes 
#  - invalid format for d&r codes 
#  - invalid date time received
#  - duplicate waste reference ids
# api errors
#  - missing mandatory fields 
#  - missing conditioanl validation errors
