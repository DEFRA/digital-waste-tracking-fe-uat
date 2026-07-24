module.exports = {
  env: {
    es2022: true,
    node: true,
    jest: true
  },
  globals: {
    before: true,
    after: true
  },
  extends: [
    'standard',
    'prettier',
    'eslint:recommended',
    'plugin:wdio/recommended'
  ],
  overrides: [
    {
      files: ['test/utils/test-data-organisations.js'],
      globals: {
        db: 'readonly',
        ISODate: 'readonly'
      }
    }
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  plugins: ['prettier', 'wdio'],
  rules: {
    'prettier/prettier': 'error',
    'no-console': 'error',
    "no-empty": [2, { "allowEmptyCatch": true }]
  }
}
