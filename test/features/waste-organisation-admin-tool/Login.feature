@feature=AdminToolLogin @issue=DWTA-250 @browserstack-admin-tool
Feature: Login to the DWT Admin Portal
  As an internal user of the DWT Admin Portal
  I want to sign in with my username and password
  So that I can access admin reporting features.

  Scenario: user can sign in with valid credentials
    Given the user navigates to the admin tool login page
    When the user signs in with valid admin credentials
    Then the user should be logged in to the admin tool successfully

  Scenario: user can show and hide the password
    Given the user navigates to the admin tool login page
    And the user has entered a password on the admin tool login page
    When the user clicks the show password button
    Then the entered password should be visible
    When the user clicks the hide password button
    Then the entered password should be hidden

  Scenario Outline: invalid login input displays the expected error
    Given the user navigates to the admin tool login page
    When the user attempts to sign in with "<fixture>" credentials
    Then the admin tool login errors for "<fixture>" should be displayed
    And the user should remain on the admin tool login page

    Examples:
      | fixture               |
      | both_empty            |
      | missing_username      |
      | missing_password      |
      | incorrect_username    |
      | incorrect_password    |
      | incorrect_credentials |
