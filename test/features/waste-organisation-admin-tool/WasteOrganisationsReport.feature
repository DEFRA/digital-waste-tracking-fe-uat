@feature=WasteOrganisationsByDateRange @issue=DWTA-241 @issue=DWTA-242 @issue=DWTA-248 @browserstack-admin-tool
Feature: Waste organisations report
  As an internal user of the DWT Admin Portal
  I want to search waste organisations by registration date
  So that I can view organisations and their active API code counts in a given period.

  Scenario: the waste organisations report page loads with the search form
    Given the user navigates to the waste organisations report page
    Then the waste organisations report search form should be displayed

  Scenario: organisations are displayed for a wide date range
    Given the user navigates to the waste organisations report page
    When the user searches for organisations in the "full_range" date range
    Then the waste organisations report results should match the "full_range" fixture

  Scenario: organisations on a single day are displayed when start and end dates are the same
    Given the user navigates to the waste organisations report page
    When the user searches for organisations in the "single_day" date range
    Then the waste organisations report results should match the "single_day" fixture

  Scenario: no organisations are displayed when there are no matches in the date range
    Given the user navigates to the waste organisations report page
    When the user searches for organisations in the "empty_range" date range
    Then no waste organisations should be displayed
    And the download CSV button should not be displayed

  Scenario: the downloaded CSV matches the report for a wide date range
    Given the user navigates to the waste organisations report page
    When the user searches for organisations in the "full_range" date range
    And the user downloads the waste organisations report CSV for the "full_range" date range
    Then the downloaded CSV filename should match the "full_range" fixture
    And the downloaded CSV contents should match the "full_range" fixture

  Scenario Outline: invalid date input displays a validation error
    Given the user navigates to the waste organisations report page
    When the user enters invalid dates for "<fixture>"
    Then a date validation error should be displayed for "<fixture>"

    Examples:
      | fixture                     |
      | invalid_from_date           |
      | invalid_to_date             |
      | invalid_to_date_non_numeric |
      | invalid_calendar_from_date  |
      | from_date_after_to_date     |
      | both_dates_invalid          |
