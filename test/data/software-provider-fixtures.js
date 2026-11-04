export const CLIENT_NAME_VALIDATION_FIXTURES = {
  empty: {
    clientName: '',
    error: 'Enter a client name'
  },
  invalid_characters: {
    clientName: 'Waste-Tech 1',
    error:
      'Client name must only include letters a to z, numbers, hyphens, underscores and full stops'
  },
  too_long: {
    clientName: 'a'.repeat(129),
    error: 'Client name must be 128 characters or fewer'
  }
}
