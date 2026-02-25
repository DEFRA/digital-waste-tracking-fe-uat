@issue=DWT-1425
Feature: Download Spreadsheet Template
As a waste receiver
I want to download the official spreadsheet template
So that I can populate it with waste movement data before uploading.

  @env_dev @accessibility
  Scenario: Waste receiver should be able to download the official spreadsheet template
    Given a user is logged in to the waste receiver registration portal
    And user selects option to download spreadsheet template
    When user clicks on the Download spreadsheet button
    Then the template must get downloaded to the user's local machine

  @env_test @accessibility
  Scenario Outline: Waste receiver should be able to login via "<account_type>" and download the official spreadsheet template
    Given a user is logged in to the waste receiver registration portal using a "<account_type>" account
    And user selects option to download spreadsheet template
    When user clicks on the Download spreadsheet button
    Then the template must get downloaded to the user's local machine
  
  Examples:
    | account_type |
    | Gov UK       |
    | Government Gateway |
    