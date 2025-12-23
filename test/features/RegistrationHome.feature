@feature=RegistrationHome @issue=DWT-1163
Feature: Home page of Waste receiver registration portal
"""
As a user of a waste receiving organisation, 
I want to access the waste receiver registration portal 
so that I can register as a waste receiver.
"""

  @env_dev @env_test @accessibility
  Scenario: User should be able to login for the first time using a Government Gateway account
    Given a user is on Report of waste registration start page
    When user clicks on the "Start now" button
    Then user should be redirected to Defra Id service

# Note: there will be seperate tests defined for feedback link etc. when the tickets get played