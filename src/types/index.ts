import type tmi from 'tmi.js'

export interface MessageData {
  id?: string | undefined
  message?: string
  sentAt?: string | undefined

  badgeInfo?: tmi.BadgeInfo | undefined
  badgeInfoRaw?: string | undefined
  badges?: tmi.Badges | undefined
  badgesRaw?: string | undefined
  color?: string | undefined
  displayName?: string | undefined
  emotes?: { [emoteid: string]: string[] } | undefined
  emotesRaw?: string | undefined
  flags?: string | undefined
  messageType?: string | undefined
  mod?: boolean | undefined
  roomID?: string | undefined
  subscriber?: boolean | undefined
  turbo?: boolean | undefined
  userID?: string | undefined
  userType?: string | undefined
  username?: string | undefined
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
