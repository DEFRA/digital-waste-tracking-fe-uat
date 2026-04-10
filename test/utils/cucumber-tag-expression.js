/**
 * Builds the Cucumber tag filter: base `@env_*` from config, optionally ANDed with
 * `CUCUMBER_EXTRA_TAGS` (e.g. `@debug`, `@foo and @bar`).
 *
 * CLI `--cucumberOpts.tags=...` replaces `cucumberOpts.tags` entirely; use
 * `CUCUMBER_EXTRA_TAGS` when you need to narrow runs without losing the env tag.
 */
export function buildCucumberTagExpression(envTagSuffix) {
  const base = `@env_${envTagSuffix}`
  const extra = process.env.CUCUMBER_EXTRA_TAGS?.trim()
  if (!extra) return base
  return `${base} and (${extra})`
}
