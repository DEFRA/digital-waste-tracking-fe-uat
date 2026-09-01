@issue=DR-48 @env_local @zap
Feature: Analyse security report
 
  Scenario: Analyse zap security report for any High risk issues
    When a zap security report is available
    Then assert that there are no High risk issues in the zap security report


