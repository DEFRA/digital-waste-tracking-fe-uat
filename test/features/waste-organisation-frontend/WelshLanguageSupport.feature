@welsh_language_support @issue:DR-93
Feature: Welsh Language Support
    As a Waste Receiver who is a Welsh speaker
    I want the service to be available in the Welsh language
    So that I can use it more easily

  @env_dev @env_test
  Scenario: Waste Receiver can select Welsh language
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    When user switches to "Welsh" language
    Then user should see his preference changed to "Welsh"
    And user should see the content in "Welsh" on "account-home" page

  @env_dev @env_test
  Scenario: If language cookie is set to Welsh, when user launches the service, they should see the content in Welsh
    Given browsers language cookie is set to "Welsh"
    And user launches report receipt of waste service
    Then user should see the content in "Welsh" on "uk-permit" page

  @env_dev @env_test
  Scenario: User must be able to switch back to English language
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And user switches to "Welsh" language
    And user should see his preference changed to "Welsh"
    And user should see the content in "Welsh" on "account-home" page
    When user switches to "English" language
    Then user should see his preference changed to "English"
    And user should see the content in "English" on "account-home" page

  @env_dev
  Scenario Outline: User must be displayed with Welsh content in gov pay, if users preference is Welsh
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And user switches to "Welsh" language
    And user should see his preference changed to "Welsh"
    When the service charge is due
    And user pays the service charge using a valid "<card_brand>" "<card_type>" card "<card_number>"
    And the user should be redirected to "payment-confirmation" page
    Then the payment should be "successful"
    And the account page should reflect that the service charge has been paid

    @env_dev
    Examples:
      | card_brand       | card_type        | card_number      |
      | Visa             | Credit           | 4444333322221111 |