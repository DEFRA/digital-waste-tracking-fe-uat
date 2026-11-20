@feature=AdminUiLogin @issue=DWTSPI-531
Feature: Sign in to the DWT Admin Portal
  As an internal user of the DWT Admin Portal
  I want to sign in with my Microsoft Entra ID account
  So that I can access admin reporting features.

  @browserstack-admin-ui
  Scenario: user is signed in with Entra ID
    Given the user opens the admin tool
    Then the user should be signed in to the admin tool

  Scenario: user is returned to the software providers page after signing in
    Given the user opens the software providers page before signing in
    Then the user should be on the software providers page
