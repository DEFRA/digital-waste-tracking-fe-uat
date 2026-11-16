# Todo: standardise page heading getters

Page objects mix `heading` and `pageHeading`. The base `Page` has `pageHeading` as `$('h1')`. Many subclasses repeat `get heading() { return $('h1') }`. Others need a different selector and must keep their own getter:

- Admin UI and local-authority pages: `[data-testid="app-heading-title"]`
- Defra ID choose sign-in: `#replacementSelectIdentityProvider h1#header`
- Defra ID org picker: `#header`
- Defra ID stub: `span.govuk-caption-m`
- Government Gateway: `govGatewayLoginPageheading`

`verifyPageHeading` currently uses `pageHeading`, so it always checks `$('h1')` even when the page’s real heading is elsewhere.

## Done when

- One base getter name on `Page` (pick `heading` or `pageHeading` and use it everywhere).
- Subclasses only override that getter when the selector is not `$('h1')`.
- Duplicate `$('h1')` getters are removed.
- `verifyPageHeading` and page assertions use that getter, so pages with a non-`h1` heading are checked against the right element.
