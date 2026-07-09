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

  @env_dev @issue=DWT-1967
  Scenario: Waste receiver sees a notification when trying to pay an already paid service charge
    Given a user is logged in to the waste receiver registration portal
    When the service charge has already been paid
      | card_number | 4444333322221111 |
    And the user initiates to pay the service charge
    Then the user should see the service charge notification banner
      | heading | A payment has already been submitted                                                    |
      | body    | A service charge payment for this account has already been processed. Do not try again. |

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

  @issue=DWT-2156 @issue=DWT-2425
  Scenario Outline: Waste receiver must be able to pay service charge for an organisation with a valid card "<card_number>"
    Given a user is logged in to the waste receiver registration portal
    When the service charge is due
    And user pays the service charge using a valid "<card_brand>" "<card_type>" card "<card_number>"
    And the user should be redirected to "payment-confirmation" page
    Then the payment should be "successful"

    @env_dev
    Examples:
      | card_brand       | card_type        | card_number      |
      | Visa             | Credit           | 4444333322221111 |
      | Visa             | Debit            | 4000056655665556 |
      | Visa             | Debit corporate  | 4988080000000000 |
      | Visa             | Credit corporate | 4111111111111111 |
      | Mastercard       | Credit           |  222100000000000 |
      | American Express | Credit           |  371449635398431 |
    # @env_test
    # Examples:
    #   | card_brand | card_type | card_number      |
    #   | Visa       | Credit    | 4444333322221111 |

  @env_dev @env_test @issue=DWT-2156
  Scenario Outline: Waste receiver must be able to pay service charge for an organisation with a card "<reason>" "<card_number>"
    Given a user is logged in to the waste receiver registration portal
    When the service charge is due
    And user pays the service charge using "<card_brand>" "<card_type>" card "<card_number>"
    Then the payment should be "unsuccessful"
    And the user should see an error message "<expected error message>"

    Examples:
      | card_brand | card_type | card_number      | reason                      | expected error message                             |
      | Visa       | Credit    | 4000000000000069 | that is expired             | There was a problem with your payment - GOV.UK Pay |
      | Visa       | Debit     | 4000000000000127 | with invalid CVC code       | There was a problem with your payment - GOV.UK Pay |
      | Visa       | Credit    | 4000000000000119 | which gives a general error | We’re experiencing technical problems - GOV.UK Pay |
      | Visa       | Debit     | 4000000000000002 | which gets payment declined | There was a problem with your payment - GOV.UK Pay |
      # | Maestro    | Debit     | 6759649826438453 | Card type not accepted | -- this returns an error on gov pay page
