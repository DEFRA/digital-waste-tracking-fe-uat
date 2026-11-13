# Todo: BrowserStack from GitHub

GitHub does not start a BrowserStack run. The refactor left this for later. Which runner that workflow calls waits on `changes/todo/separate-runners.md`.

## Done when

A GitHub workflow can run `test:browserstack:compatibility:defra-id-stub` or `test:browserstack:compatibility:defra-id-real` with the BrowserStack secrets, and it does not source `env.sh`.
