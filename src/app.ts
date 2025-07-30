import process from 'node:process'
import tmi from 'tmi.js'
import {
  formatMessage,
  logMessage,
  logSus,
  logTestMessage,
} from './utils'

import 'dotenv/config'

// Create a client with options
const client = new tmi.Client({
  connection: {
    reconnect: true,
    secure: true,
  },
  channels: [process.env.CHANNEL || 'jerma985'],
})

// Register event handlers
client.on('message', (_channel, tags, message, _self) => {
  const messageData = formatMessage(tags, message)

  if (messageData.username === 'moduspwnens') {
    logTestMessage(messageData)
  }

  if (messageData.username === process.env.USER) {
    logMessage(messageData)
  }

  if (
    messageData.username === process.env.USER
    || (messageData.mod && messageData.username !== 'nightbot')
  ) {
    logSus(messageData)
  }
})

// Connection events
client.on('connecting', (address, port) => {
  // eslint-disable-next-line no-console
  console.log('Connecting:', process.env.CHANNEL, address, port)
})

client.on('connected', (address, port) => {
  // eslint-disable-next-line no-console
  console.log('Connected:', process.env.CHANNEL, address, port)
})

client.on('disconnected', (reason) => {
  // eslint-disable-next-line no-console
  console.log('Disconnected:', reason)
})

client.on('reconnect', () => {
  // eslint-disable-next-line no-console
  console.log('Attempting to reconnect')
})

// Connect to Twitch
client.connect()
