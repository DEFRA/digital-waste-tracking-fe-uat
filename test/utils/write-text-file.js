import { existsSync } from 'fs'
import { mkdir, writeFile, readFile } from 'fs/promises'
import { dirname } from 'path'

/**
 * @param {string} filePath
 * @param {string} content
 * @returns {Promise<void>}
 */
export async function writeTextToFile(filePath, content) {
  await mkdir(dirname(filePath), { recursive: true })
  await writeFile(filePath, content, 'utf8')
}

/**
 * Assert a scan artefact exists, read it, and attach to Allure when available.
 * @param {string} path
 * @param {string} label
 * @param {string} contentType - Allure attachment content type
 * @returns {Promise<string>}
 */
export async function readZapReport(path, label, contentType) {
  if (!existsSync(path)) {
    throw new Error(`ZAP report file not found: ${path}`)
  }

  const content = await readFile(path, 'utf8')
  if (globalThis.allure) {
    await globalThis.allure.attachment(label, content, contentType)
  }

  return content
}
