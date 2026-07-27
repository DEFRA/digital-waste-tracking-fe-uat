export const LOGIN_VALIDATION_FIXTURES = {
  both_empty: {
    username: '',
    password: '',
    expectedSummaryErrors: ['Enter a username', 'Enter a password'],
    expectInlineErrors: false
  },
  missing_username: {
    username: '',
    password: 'some-password',
    expectedSummaryErrors: ['Enter a username'],
    expectInlineErrors: false
  },
  missing_password: {
    username: 'test-user',
    password: '',
    expectedSummaryErrors: ['Enter a password'],
    expectInlineErrors: false
  },
  incorrect_username: {
    username: 'incorrect-admin-username',
    password: 'incorrect-password',
    useConfiguredUsername: false,
    expectedSummaryErrors: ['Enter a correct username and password'],
    expectInlineErrors: true,
    expectedInlineError: 'Enter a correct username and password'
  },
  incorrect_password: {
    username: '',
    password: 'incorrect-password',
    useConfiguredUsername: true,
    expectedSummaryErrors: ['Enter a correct username and password'],
    expectInlineErrors: true,
    expectedInlineError: 'Enter a correct username and password'
  },
  incorrect_credentials: {
    username: 'incorrect-admin-username',
    password: 'incorrect-password',
    useConfiguredUsername: false,
    expectedSummaryErrors: ['Enter a correct username and password'],
    expectInlineErrors: true,
    expectedInlineError: 'Enter a correct username and password'
  }
}
