@issue=DWT-2283
Feature: Permitted waste receiver and not LA
  As a user of a waste receiving organisation,
  I access the waste receiver registration portal
  I need to indicate whether I am permitted to receive waste in the UK

  @accessibility @defra-id-stub @defra-id-real
  Scenario: User indicates that they are not a local authority
    Given a user is on are you a local authority page
    When user selects the "No" option to indicate they are not a local authority
    And user clicks on the "Continue" button
    Then user should be redirected to Defra Id service


  @accessibility @issue=DR-59 @defra-id-stub @defra-id-real
  Scenario: User indicates that they are a local authority
    Given a user is on are you a local authority page
    When user selects the "Yes" option to indicate they are a local authority
    And user clicks on the "Continue" button
    Then user should be redirected to "local-authority-guidance" page
    And user should be able to see the guidance for local authorities on the page
    And user clicks on the "Continue" button
    And user should be redirected to Defra Id service

  @issue=DR-60 @defra-id-stub
  Scenario: Local authority answer is recorded against the organisation
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account as a local authority
    Then the organisation details should be available with local authority set to true
    When the same user logs back in to the waste receiver registration portal selecting "No" for local authority
    Then the organisation details should be available with local authority set to true

  @issue=DR-60 @defra-id-stub
  Scenario: Non local authority answer is not recorded against the organisation
    Given a user is logged in to the waste receiver registration portal using a "Gov UK" account
    Then my organisation record should not be updated with my response
    When the same user logs back in to the waste receiver registration portal selecting "Yes" for local authority
    Then my organisation record should not be updated with my response

  @issue=DWT-1366 @accessibility @defra-id-stub @defra-id-real
  Scenario: User does not indicate whether they are a local authority and clicks on continue
    Given a user is on are you a local authority page
    When user clicks on the "Continue" button
    Then user should be presented with an error message as below
      | message                                                |
      | Select Yes if you are registering as a local authority |

  @issue=DWT-1990 @defra-id-stub @defra-id-real
  Scenario: Once user is logged in, he should not be asked to indicate whether they are a local authority
    Given a user is logged in to the waste receiver registration portal
    And the user navigates to report receipt of waste
    When user navigates to are you a permitted waste receiver page
    Then user should be redirected to "account-home" page
# Note: there will be seperate tests defined for feedback link etc. when the tickets get played
