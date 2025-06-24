import type tmi from 'tmi.js'

export interface MessageData {
  id?: string
  message?: string
  sentAt?: string

  badgeInfo?: tmi.BadgeInfo
  badgeInfoRaw?: string
  badges?: tmi.Badges
  badgesRaw?: string
  color?: string
  displayName?: string
  emotes?: {
    [emoteid: string]: string[]
  }
  emotesRaw?: string
  flags?: string
  messageType?: string
  mod?: boolean
  roomID?: string
  subscriber?: boolean
  turbo?: boolean
  userID?: string
  userType?: string
  username?: string
  reply?: {
    parent: {
      displayName: string
      msgBody: string
      msgID: string
      userID: string
      userLogin: string
    }
    threadParent: {
      displayName: string
      msgID: string
      userID: string
      userLogin: string
    }
  }
}

export interface TmiTags extends tmi.ChatUserstate {
  reply?: {
    parent: {
      displayName: string
      msgBody: string
      msgID: string
      userID: string
      userLogin: string
    }
    threadParent: {
      displayName: string
      msgID: string
      userID: string
      userLogin: string
    }
  }
}
