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
 * Connect to MongoDB
 * @returns {Promise<Object>} MongoDB database instance
 */
export async function connectToMongoDB() {
  if (db) {
    return db
  }

  try {
    client = new MongoClient(MONGO_URI)
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
