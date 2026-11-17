# Todo: create API clients on demand

`ApiFactory.create` builds every client up front and reads every support URL from `TestConfig`. In environments where a key is absent (for example admin-only or frontend-only packs), that read fails the scenario before any step needs that API.

The missing-key checks in `TestConfig.#string` and `TestConfig.#list` are commented out for now so those runs can proceed. That is temporary.

## Done when

- `ApiFactory` (or the world) creates a client only when a step first needs it.
- A support key is read only for that client.
- `TestConfig.#string` and `TestConfig.#list` throw again via `#missing` when the value is the wrong type or absent.
- A scenario that never uses an API does not require that API’s URL in the support file.
