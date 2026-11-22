@feature=AdminUiManageSoftwareProvider
Feature: Manage a software provider
  As an internal user of the DWT Admin Portal
  I want to add, replace and remove a software provider's secrets, and delete the provider
  So that a provider can change credentials, and a provider Defra no longer works with can be removed

  @issue=DWTSPI-496 @issue=DWTSPI-535 @accessibility
  Scenario: the software provider page shows one secret and its actions
    Given the user is on the create client credentials page
    When the user generates credentials for a new client
    Then the new client credentials should be displayed
    When the user closes the client credentials page
    Then the software provider page should show one secret
    And the newest secret should be tagged as new
    And the software provider page should generate accessibility tests
    When the user reloads the software provider page
    Then the newest secret should not be tagged as new

  @issue=DWTSPI-466 @issue=DWTSPI-496 @issue=DWTSPI-535 @issue=DWTSPI-536 @browserstack-admin-ui
  Scenario: adding another secret keeps the first and shows only the new one
    Given the user is on the create client credentials page
    When the user generates credentials for a new client
    Then the new client credentials should be displayed
    When the user closes the client credentials page
    And the user adds another secret
    Then the new client credentials should be displayed
    And the old client secret should not be shown
    When the user closes the client credentials page
    Then the software provider page should show two secrets
    And the newest secret should be tagged as new
    When the user reloads the software provider page
    Then the newest secret should not be tagged as new

  @issue=DWTSPI-466 @issue=DWTSPI-496 @issue=DWTSPI-505 @issue=DWTSPI-518
  Scenario: removing the older secret asks first, then leaves one secret
    Given the user is on the create client credentials page
    When the user generates credentials for a new client
    Then the new client credentials should be displayed
    When the user closes the client credentials page
    And the user adds another secret
    Then the new client credentials should be displayed
    When the user closes the client credentials page
    Then the software provider page should show two secrets
    When the user selects remove secret
    Then the remove secret page should explain that the older secret will stop working
    And the security team email should be ready to send
    When the user goes back to the software provider
    Then the software provider page should show two secrets
    When the user selects remove secret
    And the user confirms removing the secret
    Then the secret removed message should be displayed
    And the software provider page should show one secret
    When the user reloads the software provider page
    Then the secret removed message should not be displayed

  @issue=DWTSPI-466 @issue=DWTSPI-505 @issue=DWTSPI-518
  Scenario: replacing the only secret asks first, then shows the new secret once
    Given the user is on the create client credentials page
    When the user generates credentials for a new client
    Then the new client credentials should be displayed
    When the user closes the client credentials page
    And the user selects replace secret
    Then the replace secret page should explain that the secret will stop working
    And the security team email should be ready to send
    When the user goes back to the software provider
    Then the software provider page should show one secret
    When the user selects replace secret
    And the user confirms replacing the secret
    Then the new client credentials should be displayed
    And the old client secret should not be shown
    When the user closes the client credentials page
    Then the software provider page should show one secret
    And the newest secret should be tagged as new
    When the user reloads the software provider page
    Then the newest secret should not be tagged as new

  @issue=DWTSPI-469
  Scenario: deleting a software provider asks first, then removes it from the list
    Given the user is on the create client credentials page
    When the user generates credentials for a new client
    Then the new client credentials should be displayed
    When the user closes the client credentials page
    And the user selects delete software provider
    Then the delete software provider page should explain that the whole record will be deleted
    When the user goes back to the software provider
    Then the software provider page should show one secret
    When the user selects delete software provider
    And the user confirms deleting the software provider
    Then the software provider deleted message should be displayed
    And the deleted client should not be listed
    When the user reloads the software providers page
    Then the software provider deleted message should not be displayed
    When the user opens the deleted software provider
    Then the software providers page should be displayed
