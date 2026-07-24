@feature=WasteOrganisationsByDateRange @issue=DWTA-238 @issue=DWTA-275 @env_dev @env_test
Feature: Get organisations by date range endpoint validation
  As a consumer of the waste organisation backend API
  I need to retrieve organisations registered within a start and end date
  So that I can report on registered organisations and their active API code counts.

  Scenario: all seeded organisations are returned for a wide date range and are sorted by dateRegistered descending
    When the get-organisations-by-date-range endpoint is called for "full_range" date range
    Then a successful response with matching organisations should be returned
    And organisations should be sorted by dateRegistered descending

  Scenario: organisations registered on a single day are returned when start and end dates are the same
    When the get-organisations-by-date-range endpoint is called for "single_day" date range
    Then a successful response with matching organisations should be returned
    And organisations should be sorted by dateRegistered descending

  Scenario: a subset of organisations is returned for a narrower date range
    When the get-organisations-by-date-range endpoint is called for "narrow_range" date range
    Then a successful response with matching organisations should be returned

  Scenario: an empty list is returned when no organisations fall in the date range
    When the get-organisations-by-date-range endpoint is called for "empty_range" date range
    Then an empty organisations list should be returned

  Scenario: only active API codes are counted in activeApiCodeCount
    When the get-organisations-by-date-range endpoint is called for "full_range" date range
    Then a successful response with matching organisations should be returned
    And only active API codes should be reflected in activeApiCodeCount

  Scenario: organisations with the same dateRegistered are ordered by organisationId descending
    When the get-organisations-by-date-range endpoint is called for "same_registered_timestamp" date range
    Then a successful response with matching organisations should be returned
    And organisations with the same dateRegistered should be ordered by organisationId descending

  Scenario Outline: invalid query parameters return a bad request validation error
    When the get-organisations-by-date-range endpoint is called for "<fixture>" validation error
    Then a bad request validation error should be returned

    Examples:
      | description                          | fixture            |
      | startDate is after endDate           | start_after_end    |
      | startDate query parameter is missing | missing_start_date |
      | endDate query parameter is missing   | missing_end_date   |
      | date is not in ISO 8601 format       | invalid_date       |
