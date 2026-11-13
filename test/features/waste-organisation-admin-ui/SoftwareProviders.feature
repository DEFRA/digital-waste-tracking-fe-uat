@feature=AdminUiSoftwareProviders @env_dev @env_test @env_local
Feature: Software providers
  As an internal user of the DWT Admin Portal
  I want to see and create software provider credentials
  So that software providers can be easily managed

  @issue=DWTSPI-456 @browserstack-admin-ui
  Scenario: all clients from the client sync service are shown
    Given the user navigates to the software providers page
    When the get-all-clients endpoint is called
    Then the software providers page should list every client

  @issue=DWTSPI-456
  Scenario: client credential columns can be sorted
    Given the user navigates to the software providers page
    When the user sorts the "Client name" column
    Then the "Client name" column should be sorted "descending"
    When the user sorts the "Client name" column
    Then the "Client name" column should be sorted "ascending"
    When the user sorts the "Client ID" column
    Then the "Client ID" column should be sorted "ascending"
    When the user sorts the "Client ID" column
    Then the "Client ID" column should be sorted "descending"
    When the user sorts the "Environment" column
    Then the "Environment" column should be sorted "ascending"
    When the user sorts the "Environment" column
    Then the "Environment" column should be sorted "descending"

  @issue=DWTSPI-456 @accessibility
  Scenario: software providers page generates accessibility tests
    Given the user navigates to the software providers page
    Then the software providers page should generate accessibility tests

  @issue=DWTSPI-458
  Scenario: create new credentials opens the name page
    Given the user navigates to the software providers page
    When the user selects create new credentials
    Then the create client credentials page should be displayed

  @issue=DWTSPI-458
  Scenario: cancel returns to the software providers page
    Given the user is on the create client credentials page
    When the user selects cancel
    Then the software providers page should be displayed

  @issue=DWTSPI-458
  Scenario Outline: invalid client name displays the expected error
    Given the user is on the create client credentials page
    When the user generates credentials for the "<fixture>" client name
    Then the client name error should be displayed

    Examples:
      | fixture             |
      | empty               |
      | invalid_characters  |
      | too_long            |

  @issue=DWTSPI-458
  Scenario: a duplicate client name displays an error
    Given the user navigates to the software providers page
    When the get-all-clients endpoint is called
    And the user generates credentials for an existing client name in a different case
    Then the client name error should be displayed

  @issue=DWTSPI-458 @accessibility @browserstack-admin-ui
  Scenario: a new client can be created and its secret is shown once
    Given the user is on the create client credentials page
    Then the create client credentials page should generate accessibility tests
    When the user generates credentials for a new client
    Then the new client credentials should be displayed
    And the client credentials page should generate accessibility tests
    When the user copies the client credentials
    Then the client credentials should be copied
    When the user closes the client credentials page
    Then the new client should be listed on the software providers page
    When the user returns to the client credentials page
    Then the software providers page should be displayed

  @issue=DWTSPI-512
  Scenario: a long client name wraps onto a second line without sideways scrolling
    Given the user is on the create client credentials page
    When the user generates credentials for a long wrapping client name
    And the user closes the client credentials page
    Then the long client name should be fully visible and wrap onto a second line
    And the software providers page should not scroll sideways
