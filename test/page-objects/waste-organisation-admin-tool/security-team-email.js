import { $ } from '@wdio/globals'
import { softwareProviderEnvironmentLabel } from '../../utils/software-provider-environment.js'

const SECURITY_TEAM_EMAIL = 'security.team@defra.gov.uk'
const SECURITY_TEAM_CC = 'chris.knight@defra.gov.uk,steve.wilson@defra.gov.uk'
const SECURITY_TEAM_SUBJECT = 'DWT software provider API credentials exposed'

/**
 * The replace and remove pages open a filled-in message to the security team.
 * The link is read, not opened.
 *
 * @param {{ clientId: string, clientName: string, environment: string, apiUrl: string }} client
 */
export async function verifySecurityTeamEmail({
  clientId,
  clientName,
  environment,
  apiUrl
}) {
  const link = $('[data-testid="security-team-email"]')
  await expect(link).toBeDisplayed()
  await expect(link).toHaveText(SECURITY_TEAM_EMAIL)
  await expect(link).toHaveElementClass('govuk-link--inverse')
  await expect($('[data-testid="report-exposed-credentials"]')).toHaveText(
    expect.stringContaining('If credentials have been exposed, email')
  )

  const href = await link.getAttribute('href')
  const mailto = new URL(href)
  expect(mailto.protocol).toBe('mailto:')
  expect(decodeURIComponent(mailto.pathname)).toBe(SECURITY_TEAM_EMAIL)
  expect(mailto.searchParams.get('cc')).toBe(SECURITY_TEAM_CC)
  expect(mailto.searchParams.get('subject')).toBe(SECURITY_TEAM_SUBJECT)

  const environmentLabel = softwareProviderEnvironmentLabel(environment)
  const body = [
    'Information to share with the Security Team:',
    `Environment: ${environmentLabel}`,
    `Environment URL: ${apiUrl}`,
    `Client name: ${clientName}`,
    `Client ID: ${clientId}`
  ].join('\r\n')
  expect(mailto.searchParams.get('body')).toBe(body)
}
