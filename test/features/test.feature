Feature: This is a test Feature

  # Scenario: This is test Scenario
  #   Given a user navigates to waste receiving website
  @accessibility @test
  Scenario: Verify the "Menu" link is working as expected
    Given a user navigates the home page of DEFRA website
  #   When user clicks on the "Menu" link
  #   Then the user is displayed with super-navigation-section

  # Scenario Outline: Verify the navigation link '<link>' at the top of the document is working as expected
  #     Given a user navigates the home page of DEFRA website
  #     When user clicks on the "<link>" link
  #     Then the user is navigated to the "<expected_url>" page

  #   Examples:
  #       | link                                                  | expected_url                      |
  #       | Bringing food into Great Britain                      | /bringing-food-into-great-britain |
  #       | Check for flooding                                    | /check-flooding                   |
