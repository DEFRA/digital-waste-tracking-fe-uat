@issue=DWT-1831
Feature: Restrict access to the service for Defra users not registered as an organisation
    As a user logged into a DEFRA account designated for an individual rather than an organisation,
    I want to be prevented from accessing the “Report receipt of waste” service,
    So that I do not attempt to use a service that is only available to organisation‑based accounts

  @env_test
  Scenario: User registered as an "individual" should be prevented from accessing the service
    When a user is logged in to the waste receiver registration portal with a "individual" account
    Then user should be redirected to "You cannot continue on this service" page