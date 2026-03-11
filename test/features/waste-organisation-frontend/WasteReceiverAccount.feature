Feature: Waste receiving account page
    As a signed in user
    I want to see the organisation that I am currently acting on behalf of and the actions available to me
    So that I can manage my account and complete tasks for that organisation.

@env_test
Scenario: User should be able to switch to a different organisation using the switch organisation button
    Given a user is associated with multiple businesses 
    And a user is logged in to the waste receiver registration portal using a "<account_type>" account
    And the user has selected a business that he wants to act on behalf of
    And the user is redirected to "account-home" page of that business
    When the user switches to a different business
    Then the user is redirected to "account-home" page of the new business

# Scenario: User should be able to redirected to defra my account page when they click on the manage account button
#     Given a user is logged in to the waste receiver registration portal
#     And user is on the waste receiving account page
#     When user clicks on the manage account button
#     Then user should be redirected to the defra my account page

# Scenario: User should be able to click on report receipt of waste and displayed with list of actions to choose from
#     Given a user is logged in to the waste receiver registration portal
#     And user is on the waste receiving account page
#     When user clicks on the report receipt of waste button
#     Then user should be redirected to the report receipt of waste page
