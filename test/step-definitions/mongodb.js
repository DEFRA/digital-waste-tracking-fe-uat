import { Given, When, Then } from '@wdio/cucumber-framework'
import {
  connectToMongoDB,
  findOneWasteMovementInput,
  closeMongoDBConnection
} from '../utils/mongodb-client.js'
import { expect } from '@wdio/globals'
import logger from '@wdio/logger'

const log = logger('mongodb')
let mongoDatabase = null
let queryResult = null

Given(/^I connect to MongoDB database$/, async function () {
  try {
    log.info('Attempting to connect to MongoDB...')
    mongoDatabase = await connectToMongoDB()
    expect(mongoDatabase).not.toBeNull()
    log.info('Successfully connected to MongoDB')
  } catch (error) {
    log.error('Failed to connect to MongoDB:', error)
    throw error
  }
})

When(/^I query the waste-movement-inputs collection$/, async function () {
  try {
    log.info('Querying waste-movement-inputs collection...')
    queryResult = await findOneWasteMovementInput()
    log.info('Query executed successfully')
    if (queryResult) {
      log.info('Document found:', JSON.stringify(queryResult, null, 2))
    } else {
      log.info('No documents found in collection')
    }
  } catch (error) {
    log.error('Failed to query collection:', error)
    throw error
  }
})

Then(/^I should receive a document or null result$/, async function () {
  // The result can be either a document object or null (if collection is empty)
  // Both are valid outcomes
  expect(queryResult !== undefined).toBe(true)
  log.info('Query result validation passed')
})

Then(/^I close the MongoDB connection$/, async function () {
  try {
    log.info('Closing MongoDB connection...')
    await closeMongoDBConnection()
    log.info('MongoDB connection closed successfully')
    // Reset variables
    mongoDatabase = null
    queryResult = null
  } catch (error) {
    log.error('Failed to close MongoDB connection:', error)
    throw error
  }
})
