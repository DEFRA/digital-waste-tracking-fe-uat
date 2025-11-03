Feature: This is a test Feature

  # Scenario: This is test Scenario
  #   Given a user navigates to waste receiving website

  Scenario: Verify the "Menu" link is working as expected
    Given a user navigates the home page of DEFRA website
    When user clicks on the "Menu" link
    Then the user is displayed with super-navigation-section

#   Scenario Outline: Verify the navigation links at the top of the document is working as expected

#     Examples:
#         | link                                                  | expected_url                      |
#         | Bringing food into Great Britain                      | /bringing-food-into-great-britain |
#         | Bringing your pet dog, cat or ferret to Great Britain | /bring-pet-to-great-britain       |
#         | Funding for farmers, growers and land managers        | /guidance/funding-for-farmers     |
#         | Check for flooding                                    | /check-flooding                   |
