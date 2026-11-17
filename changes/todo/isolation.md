# Todo: a scenario must run in isolation

One scenario must be able to run by itself. It must not need another scenario to have run first, and it must not share a real login with another scenario.

The browser is already isolated. The first scenario of a worker skips `reloadSession()`, and later scenarios reload. Stub users are already isolated: the scenario registers `test${Date.now()}@test.com` and `afterScenario` expires it. The gap is the shared real accounts.

## What fails

A scenario that needs a real GOV.UK or Government Gateway account reads a shared-store pool: `availableGovUKUsers`, `availableGovGatewayUsers`, `availableMultipleBusinessesGovUKUsers`, or BrowserStack `availableUsers`.

Each driver's `onPrepare` fills those pools only when `ENVIRONMENT` is `test`. On dev, local, or perf-test, or when nothing else has created the pool, login fails with `'<key>' resource pool does not exist`. If every account is already checked out, it waits and then fails with `'<key>' resource pool is empty`. `afterScenario` fails the same way when it tries to return an account to a pool that was never created.

`defaultGovUKLogin` skips the pool. Scenarios then sign in as that same account together.

The accounts are the support-file lists `govUKLogin`, `govGatewayLogin`, and `multipleBusinessesGovUKLogin`.

## Done when

- A scenario run on its own gets an account, signs in, and returns that account.
- That works on dev, local, and perf-test as well as test.
- Another scenario never receives an account that is still in use.
- An empty support list fails and names the key.
- The `ENVIRONMENT === 'test'` fill in `onPrepare` can stay as an early seed. A scenario must still pass when that fill did not run.

`changes/todo/max-workers.md` waits on this. More than one worker is not safe until a scenario runs in isolation.

A `DataPool` class is the likely home. `checkout` takes an account, and creates the pool from the support list only when the pool is missing. `release` is what `afterScenario` calls.
