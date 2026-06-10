@issue=DWT-2155
Feature: Report receipt of waste service charge
  As a waste receiver using the DWT service
  I need to be able to pay the service charge for the service
  So that I can use the service.

  @env_dev @env_test @accessibility
  Scenario: Waste receiver initiates to pay the service charge for the service
    Given a user is logged in to the waste receiver registration portal
    When the user initiates to pay the service charge
    And the user continues to pay the service charge
    And the user allowed to review the service charge details

  @env_dev @env_test @accessibility
  Scenario: Waste receiver must be able to cancel payment process after the initiation of paying the service charge
    Given a user is logged in to the waste receiver registration portal
    And the user initiates to pay the service charge
    When user cancels the pay service charge
    And the user should be redirected to "account-home" page

  @env_dev @env_test @accessibility
  Scenario: Waste receiver must be able to cancel payment process after reviewing the service charge details
    Given a user is logged in to the waste receiver registration portal
    When the user initiates to pay the service charge
    And the user continues to pay the service charge
    And the user allowed to review the service charge details
    When user cancels the review service charge
    And the user should be redirected to "account-home" page

  @issue=DWT-2156
  Scenario Outline: Waste receiver must be able to pay service charge for an organisation with a valid card "<card_number>"
    Given a user is logged in to the waste receiver registration portal
    When the service charge is due
    And user pays the service charge using a valid "<card_brand>" "<card_type>" card "<card_number>"
    Then the payment should be "successful"
    # And the user should be redirected to "account-home" page

    @env_dev
    Examples:
      | card_brand       | card_type          | card_number      |
      | Visa             | Credit             | 4444333322221111 |
      | Visa             | Debit              | 4000056655665556 |
      | Visa             | Debit - corporate  | 4988080000000000 |
      | Visa             | Credit - corporate | 4111111111111111 |
      | Mastercard       | Credit             |  222100000000000 |
      | American Express | Credit             |  371449635398431 |
    # @env_test
    # Examples:
    #   | card_brand | card_type | card_number      |
    #   | Visa       | Credit    | 4444333322221111 |

  @env_dev @env_test @issue=DWT-2156
  Scenario Outline: Waste receiver must be able to pay service charge for an organisation with an invalid card "<card_number>"
    Given a user is logged in to the waste receiver registration portal
    When the service charge is due
    And user pays the service charge using "<card_brand>" "<card_type>" card "<card_number>"
    Then the payment should be "unsuccessful"
    # And the user should see an error message
    # And the user should be redirected to "account-home" page

    Examples:
      | card_brand | card_type | card_number      | reason           |
      | Visa       | Credit    | 4000000000000069 | Card expired     |
      | Visa       | Debit     | 4000000000000127 | Invalid CVC code |
      | Visa       | Credit    | 4000000000000119 | General error    |
      | Visa       | Debit     | 4000000000000002 | Card declined    |
      # | Maestro    | Debit     | 6759649826438453 | Card type not accepted | -- this returns an error on gov pay page
