import { randomBytes } from 'node:crypto'

const ENVIRONMENT_LABELS = {
  local: 'local',
  dev: 'Dev',
  test: 'Test',
  'perf-test': 'Performance test',
  'ext-test': 'External test',
  prod: 'Production'
}

export function softwareProviderEnvironmentLabel(environment) {
  const label = ENVIRONMENT_LABELS[environment]
  if (!label) {
    throw new Error(
      `No software provider environment label for "${environment}"`
    )
  }
  return label
}

export function createCredentialsCaption(environment) {
  return `Create ${softwareProviderEnvironmentLabel(environment).toLowerCase()} environment credentials`
}

export function credentialsPanelEnvironment(environment) {
  return `${softwareProviderEnvironmentLabel(environment)} environment`
}

export function sortClientsByName(clients) {
  return [...clients].sort(
    (a, b) =>
      (a.clientName ?? '').localeCompare(b.clientName ?? '', 'en-GB', {
        sensitivity: 'base'
      }) || (a.clientId ?? '').localeCompare(b.clientId ?? '', 'en-GB')
  )
}

export function differentCase(name) {
  const changed = [...name]
    .map((character) =>
      character === character.toLowerCase()
        ? character.toUpperCase()
        : character.toLowerCase()
    )
    .join('')

  if (changed === name) {
    throw new Error(
      `Cannot build a different-case duplicate of client name "${name}"`
    )
  }

  return changed
}

export function uniqueClientName() {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz'
  const bytes = randomBytes(12)
  const suffix = [...bytes]
    .map((byte) => alphabet[byte % alphabet.length])
    .join('')
  return `UatSoftwareProvider_${suffix}`
}
