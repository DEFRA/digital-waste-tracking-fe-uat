import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { browser } from '@wdio/globals'

export function isBrowserStackSession() {
  const capabilities = browser.capabilities ?? {}
  const requestedCapabilities = browser.options?.capabilities ?? {}
  return Boolean(
    capabilities['bstack:options'] ||
      requestedCapabilities['bstack:options'] ||
      capabilities.browserstack
  )
}

export function supportsSeleniumFileDownloads() {
  if (isBrowserStackSession()) return false
  return typeof browser.deleteDownloadableFiles === 'function'
}

export function parseContentDispositionFilename(contentDisposition) {
  if (!contentDisposition) return undefined

  const utf8Match = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i)
  if (utf8Match) return decodeURIComponent(utf8Match[1])

  const quotedMatch = contentDisposition.match(/filename="([^"]+)"/i)
  if (quotedMatch) return quotedMatch[1]

  const plainMatch = contentDisposition.match(/filename=([^;]+)/i)
  return plainMatch?.[1]?.trim()
}

/**
 * Download a file by fetching the href of a link in the page context.
 * Works on BrowserStack where Selenium managed downloads are unavailable.
 *
 * @param {object} options
 * @param {string} options.selector - CSS selector for the download link
 * @param {'text'|'base64'} [options.responseType='text'] - how to return body content
 * @param {string} [options.hrefIncludes] - optional substring that href must contain
 * @returns {Promise<{ fileName?: string, content: string, contentDisposition?: string }>}
 */
export async function downloadLinkViaBrowserFetch({
  selector,
  responseType = 'text',
  hrefIncludes
}) {
  const result = await browser.execute(
    async (linkSelector, type, requiredHrefPart) => {
      const link = document.querySelector(linkSelector)
      if (!link) {
        throw new Error(`Download link not found: ${linkSelector}`)
      }

      const url = link.href
      if (requiredHrefPart && !url.includes(requiredHrefPart)) {
        throw new Error(
          `Download href does not include "${requiredHrefPart}": ${url}`
        )
      }

      const response = await fetch(url)
      if (!response.ok) {
        throw new Error(`Download failed: HTTP ${response.status}`)
      }

      const contentDisposition = response.headers.get('content-disposition')
      let content
      if (type === 'base64') {
        const buffer = await response.arrayBuffer()
        const bytes = new Uint8Array(buffer)
        let binary = ''
        for (let i = 0; i < bytes.length; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        content = btoa(binary)
      } else {
        content = await response.text()
      }

      return { content, contentDisposition }
    },
    selector,
    responseType,
    hrefIncludes
  )

  return {
    content: result.content,
    contentDisposition: result.contentDisposition,
    fileName: parseContentDispositionFilename(result.contentDisposition)
  }
}

/**
 * Wait until a downloaded file appears in Selenium managed downloads.
 *
 * @param {object} options
 * @param {string} [options.fileName] - exact filename to wait for
 * @param {RegExp} [options.filenamePattern] - pattern to match a downloaded name
 * @param {number} [options.timeout=15000]
 * @returns {Promise<string>} matched filename
 */
export async function waitForSeleniumDownloadedFile({
  fileName,
  filenamePattern,
  timeout = 15000
}) {
  let matchedName

  await browser.waitUntil(
    async () => {
      const { names } = await browser.getDownloadableFiles()
      if (fileName) {
        matchedName = names.includes(fileName) ? fileName : undefined
      } else if (filenamePattern) {
        matchedName = names.find((name) => filenamePattern.test(name))
      }
      return matchedName !== undefined
    },
    {
      timeout,
      timeoutMsg: fileName
        ? `File "${fileName}" did not appear in downloadable files in time`
        : `File matching ${filenamePattern} did not appear in downloadable files in time`
    }
  )

  return matchedName
}

/**
 * Click a download control, wait for Selenium managed download, optionally read contents.
 *
 * @param {object} options
 * @param {() => Promise<void>} options.clickDownload - action that triggers the download
 * @param {string} [options.fileName]
 * @param {RegExp} [options.filenamePattern]
 * @param {boolean} [options.readContent=false]
 * @param {string} [options.targetDir]
 * @param {number} [options.timeout=15000]
 * @returns {Promise<{ fileName: string, content?: string }>}
 */
export async function downloadViaSelenium({
  clickDownload,
  fileName,
  filenamePattern,
  readContent = false,
  targetDir = path.join(os.tmpdir(), 'wdio-downloads'),
  timeout = 15000
}) {
  await browser.deleteDownloadableFiles()
  await clickDownload()

  const matchedName = await waitForSeleniumDownloadedFile({
    fileName,
    filenamePattern,
    timeout
  })

  if (!readContent) {
    return { fileName: matchedName }
  }

  fs.mkdirSync(targetDir, { recursive: true })
  await browser.downloadFile(matchedName, targetDir)
  const content = fs.readFileSync(path.join(targetDir, matchedName), 'utf8')

  return { fileName: matchedName, content }
}
