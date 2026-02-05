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
    And user is redirected to "What do you want to do next?" page 

  @env_test @accessibility
  Scenario: User should be able to login for the first time using a Gov.uk account
    Given a user has indicated that they are a permitted waste receiver
    And user proceeds to login using a Gov.uk account
    When user enters their Gov.uk email address and password
    Then they should be logged in successfully
    And user is redirected to "What do you want to do next?" page

  @env_dev
  Scenario: User should be able to login [using defraId mock] and presented with different options to continue
    Given a user is registered in Defra Id mock service
    And a user is on are you a permitted waste receiver page
    And user selects the "Yes" option to indicate they are a permitted waste receiver
    And user clicks on the "Continue" button
    And user should be redirected to Defra Id service
    When user successfully logs in to the Defra Id mock service
    Then user is redirected to "What do you want to do next?" page

  # @env_dev @mongodb
  # Scenario: Testing mongodb connectivity
  #   Given I connect to MongoDB database
  #   When I query the waste-movement-inputs collection
  #   Then I should receive a document or null result
  #   And I close the MongoDB connection