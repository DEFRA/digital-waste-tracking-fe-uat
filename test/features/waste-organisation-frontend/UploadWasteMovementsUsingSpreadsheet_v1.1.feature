@issue=DR-290
Feature: Upload Waste Movements Using Spreadsheet v1.1
  As a waste receiver
  I want to upload a spreadsheet containing waste movement data for my selected organisation
  So that I can submit waste movement data, correctly linked to the business I have selected

  @defra-id-stub @defra-id-real
  Scenario: Waste receiver should be able to upload waste movements using a spreadsheet
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test1-spreadsheet_v1.1.xlsx" to upload
    Then the user should be redirected to "Upload successful" page
    And the file is successfully accepted for processing
    And the processed spreadsheet should contain valid WTIDs
    # And email should sent to the user with the spreadsheet and WTIDs

  @defra-id-stub
  Scenario: Waste receiver uploads a valid spreadsheet then all the waste movements should be successfully persisted
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a valid spreadsheet file "Test2-spreadsheet_v1.1.xlsx" to upload
    Then the user should be redirected to "Upload successful" page
    And the file is successfully accepted for processing
    And all the waste movements should be successfully created
    And the processed spreadsheet should contain valid WTIDs
    # And email should sent to the user with the spreadsheet and WTIDs

  @defra-id-real @defra-id-stub
  Scenario Outline: More error scenarios for waste receiver uploads a spreadsheet - <error_type>
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the user navigates to report receipt of waste
    And user selects option to upload waste movements using a spreadsheet
    When user selects copy of a spreadsheet file "<spreadsheet_file>" to upload
    Then the user should be redirected to "Upload successful" page
    And the file is successfully accepted for processing
    And no waste movements should be created
    And the processed spreadsheet should contain error details

    Examples:
      | error_type                                                                             | spreadsheet_file                           |
      | hazardousWasteConsignmentCode and reason missing, when hazardous ewc codes are present | Test2-spreadsheet-api-error-1_v1.1.xlsx |
