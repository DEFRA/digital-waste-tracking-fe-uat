@issue=DWT-2155 @serviceCharge
Feature: Report receipt of waste service charge
  As a waste receiver using the DWT service
  I need to be able to pay the service charge for the service
  So that I can use the service.

  @env_dev @env_test @accessibility @issue=DR-66
  Scenario: Waste receiver initiates to pay the service charge for the service
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    When the service charge is due
    And the user initiates to pay the service charge
    And the user continues to pay the service charge
    And the user allowed to review the service charge details

  @env_dev @issue=DWT-1967 
  Scenario: Waste receiver sees a notification when trying to pay an already paid service charge
    Given a user is logged in to the waste receiver registration portal using a "Government Gateway" account
    When the service charge has already been paid
      | card_number | 4444333322221111 |
    And the user re-attempts to pay service charge
    Then the user should see the service charge notification banner
      | heading | A payment has already been submitted                                                    |
      | body    | A service charge payment for this account has already been processed. Do not try again. |

  @env_dev @env_test @accessibility 
  Scenario: Waste receiver must be able to cancel payment process after the initiation of paying the service charge
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the service charge is due
    And the user initiates to pay the service charge
    When user cancels the pay service charge
    And the user should be redirected to "account-home" page

  @env_dev @env_test @accessibility 
  Scenario: Waste receiver must be able to cancel payment process after reviewing the service charge details
    Given a user is logged in to the waste receiver registration portal using a "Government Gateway" account
    And the service charge is due
    When the user initiates to pay the service charge
    And the user continues to pay the service charge
    And the user allowed to review the service charge details
    When user cancels the review service charge
    And the user should be redirected to "account-home" page

  @issue=DWT-2156 @issue=DWT-2425 @issue=DR-66
  Scenario Outline: Waste receiver must be able to pay service charge for an organisation with a valid card "<card_number>"
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    When the service charge is due
    And user pays the service charge using a valid "<card_brand>" "<card_type>" card "<card_number>"
    And the user should be redirected to "payment-confirmation" page
    Then the payment should be "successful"
    And the account page should reflect that the service charge has been paid

    @env_dev
    Examples:
      | card_brand       | card_type        | card_number      |
      | Visa             | Credit           | 4444333322221111 |
    # | Visa             | Debit            | 4000056655665556 |
    #  | Visa             | Debit corporate  | 4988080000000000 |
    #  | Visa             | Credit corporate | 4111111111111111 |
    #  | Mastercard       | Credit           |  222100000000000 |
    #  | American Express | Credit           |  371449635398431 |
    # @env_test
    # Examples:
    #   | card_brand | card_type | card_number      |
    #   | Visa       | Credit    | 4444333322221111 |

  @issue=DWT-2156
  Scenario Outline: Waste receiver must not be able to pay service charge for an organisation with a card "<reason>" "<card_number>"
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    When the service charge is due
    And user pays the service charge using "<card_brand>" "<card_type>" card "<card_number>"
    Then the payment should be "unsuccessful"
    And the user should see an error message "<expected error message>"
    And the account page should reflect that the service charge is pending

    @env_dev
    Examples:
      | card_brand | card_type | card_number      | reason                      | expected error message                             |
      | Visa       | Credit    | 4000000000000069 | that is expired             | There was a problem with your payment - GOV.UK Pay |
      | Visa       | Debit     | 4000000000000127 | with invalid CVC code       | There was a problem with your payment - GOV.UK Pay |
      | Visa       | Credit    | 4000000000000119 | which gives a general error | We’re experiencing technical problems - GOV.UK Pay |
      | Visa       | Debit     | 4000000000000002 | which gets payment declined | There was a problem with your payment - GOV.UK Pay |
      # # | Maestro    | Debit     | 6759649826438453 | Card type not accepted | -- this returns an error on gov pay page

    @env_test
    Examples:
    | card_brand | card_type | card_number      | reason                      | expected error message                             |
    | Visa       | Credit    | 4000000000000069 | that is expired             | There was a problem with your payment - GOV.UK Pay |
 
  @env_dev @issue=DWT-2425 
  Scenario: User must be able to continue after a payment error and retry the payment
    Given a user is logged in to the waste receiver registration portal using a "Government Gateway" account
    And the service charge is due
    And user pays the service charge using "Visa" "Debit" card "4000000000000002"
    And the payment should be "unsuccessful"
    And the user should see an error message "There was a problem with your payment - GOV.UK Pay"
    When user attempts to re-try the payment after the error
    Then the user is redirected to intiate payment page

  # @manual@issue=DR-49
  # Scenario: User must be prevented to initiate a new payment for an organisation when one is already in progress

  # @manual @issue=DR-50
  # Scenario: A different user of the same organisation must be prevented to initiate a new payment for an organisation when one is already in progress

#  webhook verified manually only in ext-test 
#  background process verified manually only in dev and test

@env_dev @issue=DWT-1967 @test1
  Scenario Outline: Waste receiver can request a refund for a service charge payment using a valid payment reference
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    And the service charge is due
    And user pays the service charge using a valid "<card_brand>" "<card_type>" card "<card_number>"
    And the user should be redirected to "payment-confirmation" page
    And the payment should be "successful"
    When user requests for refund for the payment
    Then the refund should be "successful"
    And  organisation disableAfter moves back to payment.servicePeriodStart
   Examples:
       | card_brand | card_type | card_number      |
       | Visa       | Credit    | 4444333322221111 |
