/**
 * @fileoverview Cucumber world for one scenario.
 */

/**
 * @typedef {import('../setup/test-memory.js').TestMemory} TestMemory
 */

/**
 * @typedef {import('../setup/test-env.js').TestEnv} TestEnv
 */

/**
 * @typedef {import('../setup/test-config.js').TestConfig} TestConfig
 */

/**
 * Cucumber's world. The scenario values, the env vars, and the support file each keep their own object.
 * @typedef {import('@cucumber/cucumber').World & {
 *   testMemory: TestMemory
 *   testEnv: TestEnv
 *   testConfig: TestConfig
 * }} CucumberWorld
 */

export {}
