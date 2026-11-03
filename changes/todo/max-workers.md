# Todo: add max workers

This waits on `changes/todo/isolation.md`. A scenario must run in isolation before more than one worker is safe. Two workers can still sign in as the same real GOV.UK or Government Gateway account.

`MAX_INSTANCES` already sets the runner and each capability. Unset means 1. Each worker already has its own browser. Do not add a second setting.

## Done when

- A scenario runs in isolation, as `changes/todo/isolation.md` describes.
- `MAX_INSTANCES` set above 1 runs that many workers.
- Each worker has its own browser and its own real account.
- Each pool's support list has at least as many accounts as `MAX_INSTANCES`.
