@issue=DWT-2189 @env_test @env_dev @local
Feature: Report receipt of waste service banner
    As a waste receiver user
    I want the Report receipt of waste banner link to take me to the correct page based on my sign-in status
    So that I can continue to the service if I am signed in, or be told what to do if my session has expired
    
    Scenario: "Report receipt of waste" banner link should take me to the account home page if user is signed in
        Given a user is logged in to the waste receiver registration portal
        And the user navigates to report receipt of waste
        And user selects option to view his api code
        And user is on the View API Code page
        When the user selects the "Report receipt of waste" banner link
        Then the user should be redirected to "account-home" page

    Scenario: "Report receipt of waste" banner link should take me to restricted access page if user is not signed in
        Given a user is not logged in to the waste receiver registration portal
        And a user is on are you a permitted waste receiver page
        When the user selects the "Report receipt of waste" banner link
        Then the user should be redirected to "You do not have permission to view this page" page