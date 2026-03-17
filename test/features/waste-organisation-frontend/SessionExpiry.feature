@issue=DWT-1827
Feature: Restrict access to the service for unauthenticated users or users with expired session
    As a user of the waste receiver registration portal
    When user is not logged into the service or has session expired after a period of inactivity
    Then user should see clear message indicating the reasons and be able to sign back in

  @env_dev @env_test @accessibility
  Scenario: Unauthenticated user should be displayed with an appropriate message and be able to sign back in
    Given a user is not logged in to the waste receiver registration portal
    When the user navigates to any page on the portal
    Then the user should be redirected to "You do not have permission to view this page" page

  @env_dev @env_test
  Scenario: User with invalid token should be displayed with an appropriate message when trying to access the service
    Given a user is logged in to the waste receiver registration portal
    And the user signs out of his existing session
    When the user navigates to any page on the portal
    Then the user should be redirected to "You do not have permission to view this page" page
 