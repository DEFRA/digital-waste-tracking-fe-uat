@feature=Login @issue=DWT-1163
Feature: Login as a user for waste receiving organisation
  As a user of a waste receiving organisation, 
  I have indicated that I am a permitted waste receiver
  I want to login to the waste receiver registration portal using government gateway or gov.uk account
  so that I can report my waste movements.

  @env_test
  Scenario: User should be able to login for the first time using a Government Gateway account
    Given a user has indicated that they are a permitted waste receiver
    And user proceeds to login using a Government Gateway account
    When user enters their Government user Id and password
    Then they should be logged in successfully
    # And redirected to "Is <organisation name> a waste receiver?" page
 
  @env_test @accessibility
  Scenario: User should be able to login for the first time using a Gov.uk account
    Given a user has indicated that they are a permitted waste receiver
    And user proceeds to login using a Gov.uk account
    When user enters their Gov.uk email address and password
    Then they should be logged in successfully
    # And redirected to "Is <organisation name> a waste receiver?" page