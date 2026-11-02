/**
 * The suite filter from `CUCUMBER_EXTRA_TAGS`. An empty value runs every scenario.
 *
 * CLI `--cucumberOpts.tags=...` replaces `cucumberOpts.tags` entirely.
 * @param {string} [extraTags]
 * @returns {string|undefined}
 */
export function buildCucumberTagExpression(extraTags = '') {
  const tags = extraTags.trim()
  return tags || undefined
}
