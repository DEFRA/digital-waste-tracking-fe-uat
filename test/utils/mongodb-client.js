import { fileURLToPath } from 'node:url'
import { MongoClient } from 'mongodb'
import logger from '@wdio/logger'

/**
 * MongoDB Connection Configuration
 */
const MONGO_URI =
  'mongodb://protected-mongo-01.dev.protected.cdp:27017,protected-mongo-02.dev.protected.cdp:27017,protected-mongo-03.dev.protected.cdp:27017/waste-movement-backend?authSource=$external&authMechanism=MONGODB-AWS&tls=true&readPreference=secondaryPreferred&tlsInsecure=true'

let client = null
let db = null
const log = logger('mongodb-client')

/**
 * Build MongoDB client options including optional SOCKS5 proxy settings.
 * Proxy can be set via environment variables:
 *   - MONGO_PROXY_HOST (required for proxy)
 *   - MONGO_PROXY_PORT (default 1080)
 *   - MONGO_PROXY_USERNAME (optional)
 *   - MONGO_PROXY_PASSWORD (optional)
 * Or HTTP_PROXY (e.g. http://proxy:3128) - host/port are parsed for proxyHost/proxyPort.
 * Note: MongoDB Node driver uses SOCKS5 for the connection; the driver requires the 'socks' package.
 * For MONGODB-AWS credential requests (HTTPS), set HTTP_PROXY/HTTPS_PROXY in the environment.
 * @returns {Object} MongoClientOptions
 */
function getMongoClientOptions() {
  const options = {}

  const proxyHost =
    process.env.MONGO_PROXY_HOST ||
    (process.env.HTTP_PROXY && parseProxyUrl(process.env.HTTP_PROXY)?.host)
  const proxyPort = process.env.MONGO_PROXY_PORT
    ? parseInt(process.env.MONGO_PROXY_PORT, 10)
    : (process.env.HTTP_PROXY && parseProxyUrl(process.env.HTTP_PROXY)?.port) ||
      1080

  if (proxyHost) {
    options.proxyHost = proxyHost
    options.proxyPort = proxyPort
    if (process.env.MONGO_PROXY_USERNAME) {
      options.proxyUsername = process.env.MONGO_PROXY_USERNAME
    }
    if (process.env.MONGO_PROXY_PASSWORD) {
      options.proxyPassword = process.env.MONGO_PROXY_PASSWORD
    }
    log.info('Using proxy for MongoDB connection', {
      proxyHost: options.proxyHost,
      proxyPort: options.proxyPort
    })
  }

  return options
}

/**
 * Parse HTTP_PROXY-style URL to extract host and port
 * @param {string} url - e.g. http://localhost:3128 or http://user:pass@proxy:3128
 * @returns {{ host: string, port: number }|null}
 */
function parseProxyUrl(url) {
  if (!url || typeof url !== 'string') return null
  try {
    const u = new URL(url)
    return {
      host: u.hostname,
      port: u.port ? parseInt(u.port, 10) : 1080
    }
  } catch {
    return null
  }
}

/**
 * Connect to MongoDB
 * @returns {Promise<Object>} MongoDB database instance
 */
export async function connectToMongoDB() {
  if (db) {
    return db
  }

  try {
    const clientOptions = getMongoClientOptions()
    client = new MongoClient(MONGO_URI, clientOptions)
    await client.connect()
    log.info('Successfully connected to MongoDB')
    db = client.db('waste-movement-backend')
    return db
  } catch (error) {
    log.error('Error connecting to MongoDB:', error)
    throw error
  }
}

/**
 * Find one document from waste-movement-inputs collection
 * @returns {Promise<Object|null>} The found document or null
 */
export async function findOneWasteMovementInput() {
  try {
    const database = await connectToMongoDB()
    const collection = database.collection('waste-movement-inputs')
    const result = await collection.findOne()
    log.info('Query result:', result)
    return result
  } catch (error) {
    log.error('Error querying waste-movement-inputs:', error)
    throw error
  }
}

/**
 * Find one document from waste-movement-inputs collection with filter
 * @param {Object} filter - MongoDB filter object
 * @returns {Promise<Object|null>} The found document or null
 */
export async function findOneWasteMovementInputWithFilter(filter = {}) {
  try {
    const database = await connectToMongoDB()
    const collection = database.collection('waste-movement-inputs')
    const result = await collection.findOne(filter)
    log.info('Query result:', result)
    return result
  } catch (error) {
    log.error('Error querying waste-movement-inputs:', error)
    throw error
  }
}

/**
 * Generic query method for any collection
 * @param {string} collectionName - Name of the collection
 * @param {Object} filter - MongoDB filter object
 * @param {Object} options - MongoDB query options
 * @returns {Promise<Object|null>} The found document or null
 */
export async function queryCollection(
  collectionName,
  filter = {},
  options = {}
) {
  try {
    const database = await connectToMongoDB()
    const collection = database.collection(collectionName)
    const result = await collection.findOne(filter, options)
    return result
  } catch (error) {
    log.error(`Error querying collection ${collectionName}:`, error)
    throw error
  }
}

/**
 * Close MongoDB connection
 */
export async function closeMongoDBConnection() {
  if (client) {
    await client.close()
    log.info('MongoDB connection closed')
    client = null
    db = null
  }
}

/**
 * Run when executed directly from command line: node test/utils/mongodb-client.js
 */
const __filename = fileURLToPath(import.meta.url)
const isRunDirectly = process.argv[1] === __filename

if (isRunDirectly) {
  const run = async () => {
    try {
      log.info('Attempting to connect to MongoDB...')
      const mongoDatabase = await connectToMongoDB()
      if (!mongoDatabase) {
        throw new Error('Failed to connect to MongoDB')
      }
      log.info('Successfully connected to MongoDB')

      log.info('Querying waste-movement-inputs collection...')
      const queryResult = await findOneWasteMovementInput()
      log.info('Query executed successfully')
      if (queryResult) {
        log.info('Document found:', JSON.stringify(queryResult, null, 2))
      } else {
        log.info('No documents found in collection')
      }
    } catch (error) {
      log.error('Failed:', error.message)
      process.exit(1)
    } finally {
      await closeMongoDBConnection()
      process.exit(0)
    }
  }
  run()
}
