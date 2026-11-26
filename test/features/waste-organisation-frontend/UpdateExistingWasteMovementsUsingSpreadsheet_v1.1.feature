@issue=DR-290
Feature: Update existing waste movements by uploading a spreadsheet v1.1 containing their WTIDs
  As a waste receiver
  I want to update previously submitted waste movements by re-uploading a spreadsheet containing their WTIDs
  So that I can make corrections or changes after submission.

  @defra-id-stub @defra-id-real
  Scenario: Waste receiver should be able to select an option to update waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    And user selects copy of a valid spreadsheet file "Test1-spreadsheet_v1.1.xlsx" to upload
    And the user should be redirected to "Upload successful" page
    And the file is successfully accepted for processing
    And the processed spreadsheet should contain valid WTIDs
    And the user navigates directly to report receipt of waste page on the portal
    And user selects option to update waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-update-spreadsheet_v1.1.xlsx" to update existing waste movements
    Then user should be redirected to "Spreadsheet update successful" page
    And the file is successfully accepted for processing
    And the processed spreadsheet should contain valid WTIDs
    # And email should sent to the user with the spreadsheet and WTIDs
