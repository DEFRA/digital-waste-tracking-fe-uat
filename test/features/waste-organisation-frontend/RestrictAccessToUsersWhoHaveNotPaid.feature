@issue=DR-47
Feature: Restrict access to the service for waste receivers who have not paid their service charge
    As a service provider, 
    I want to disable the data submission functionality for users who have not paid their service charge, so that I can ensure those users pay their service charge
  
  @env_dev
  Scenario: waste reciever user must not be able to upload waste movements or manage api code if service charge is not paid
    Given a user is logged in to the waste receiver registration portal
    And the service charge is due for the organisation
    When the user navigates to report receipt of waste
    Then user should only have option to Download spreadsheet template 
    
