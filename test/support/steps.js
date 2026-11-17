import {
  Given as cucumberGiven,
  When as cucumberWhen,
  Then as cucumberThen
} from '@wdio/cucumber-framework'

/**
 * A step function. `this` is the scenario world.
 * @callback WorldStep
 * @this {import('../types/globals.js').CucumberWorld}
 * @param {...*} args
 * @returns {void | Promise<void>}
 */

/**
 * Cucumber's step registration. Both call shapes are kept. The step's `this` is the scenario world.
 * @typedef {(pattern: string | RegExp, code: WorldStep) => void} DefineStep
 * @typedef {(
 *   pattern: string | RegExp,
 *   options: { timeout?: number, wrapperOptions?: * },
 *   code: WorldStep
 * ) => void} DefineStepWithOptions
 * @typedef {DefineStep & DefineStepWithOptions} DefineWorldStep
 */

/** @type {DefineWorldStep} */
export const Given = cucumberGiven

/** @type {DefineWorldStep} */
export const When = cucumberWhen

/** @type {DefineWorldStep} */
export const Then = cucumberThen
