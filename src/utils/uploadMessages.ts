/* eslint-disable no-console */
import { logMessage, logTestMessage } from './index'

const defaultInfo = {
  badgeInfo: {
    subscriber: '116',
  },
  badgeInfoRaw: 'subscriber/116',
  badges: {
    broadcaster: '1',
    moments: '6',
    subscriber: '3060',
  },
  badgesRaw: 'broadcaster/1,subscriber/3060,moments/6',
  color: '#00FF7F',
  displayName: 'Jerma985',
  emotes: undefined,
  emotesRaw: undefined,
  flags: undefined,
  messageType: 'chat',
  mod: false,
  roomID: '23936415',
  subscriber: true,
  turbo: false,
  userID: '23936415',
  userType: undefined,
  username: 'jerma985',
}

const messages = [
  {
    id: '1750306896',
    sentAt: '1750306896000',
    message: 'Heyo!',

    ...defaultInfo,
  },
  {
    id: '1750332108',
    sentAt: '1750332108000',
    message: 'just a heads up, vod from yesterday is coming down',

    ...defaultInfo,
  },
  {
    id: '1750332129',
    sentAt: '1750332129000',
    message: ' i highlighted the dracula 3 part, it has chat and is good, but the sponsor part is comin out',

    ...defaultInfo,
  },
  {
    id: '1750332162',
    sentAt: '1750332162000',
    message: 'everythings all good, dont worry',

    ...defaultInfo,
  },
  {
    id: '1750332180',
    sentAt: '1750332180000',
    message: 'but if people are lookin for the vod, its on the highlight page',

    ...defaultInfo,
  },
  {
    id: '1750332204',
    sentAt: '1750332204000',
    message: 'can you guys confirm it is there ina  sec?',

    ...defaultInfo,
  },
  {
    id: '1750332271',
    sentAt: '1750332271000',
    message: 'vod should be gone',

    ...defaultInfo,
  },
  {
    id: '1750332281',
    sentAt: '1750332281000',
    message: 'highlight should be up with drac 3',

    ...defaultInfo,
  },
  {
    id: '1750332330',
    sentAt: '1750332330000',
    message: 'thanks guys, ill see ya Sunday!!!',

    ...defaultInfo,
  },
]
async function uploadMessages(msgs: typeof messages) {
  const messagesPromiseArray = msgs.map((message) => {
    return logMessage(message)
  })

  try {
    await Promise.all(messagesPromiseArray)
  }
  catch (error) {
    console.error('Error uploading messsages', error)
  }
}

uploadMessages(messages)
  .then(() => {
    console.log('Done')
  })
  .catch((err: any) => {
    console.log(err)
  })
