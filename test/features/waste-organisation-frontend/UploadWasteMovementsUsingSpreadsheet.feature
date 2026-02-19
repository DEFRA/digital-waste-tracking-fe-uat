@issue=DWT-1689
Feature: Upload Waste Movements Using Spreadsheet
As a waste receiver
I want to upload a spreadsheet containing waste movement data for my selected organisation
So that I can submit waste movement data, correctly linked to the business I have selected 

  @env_dev @accessibility 
  Scenario: Waste receiver should be able to upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And user selects option to upload waste movements using a spreadsheet
    When user selects a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    Then user should be redirected to "Upload successful" page
    # To Do: pending dev work
    # And all the waste movements should be successfully created
    # And email should sent to the user with the spreadsheet and WTIDs

  @env_test @accessibility
  Scenario: Waste receiver should be able to login via Gov.uk and upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And user selects option to upload waste movements using a spreadsheet
    When user selects a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    Then user should be redirected to "Upload successful" page
    # To Do: pending dev work
    # And all the waste movements should be successfully created
    # And email should sent to the user with the spreadsheet and WTIDs

  @env_test @accessibility
  Scenario: Waste receiver should be able to login via Government Gateway and upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal using a "Government Gateway" account
    And user selects option to upload waste movements using a spreadsheet
    When user selects a valid spreadsheet file "Test1-spreadsheet.xlsx" to upload
    Then user should be redirected to "Upload successful" page
    # To Do: pending dev work
    # And all the waste movements should be successfully created
    # And email should sent to the user with the spreadsheet and WTIDs

# user should not be able to continue without uploading a spreadsheet