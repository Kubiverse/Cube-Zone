import gql from 'graphql-tag'
import { cuberBasicFragment, roomBasicFragment } from '~/gql/fragments.js'

export const CUBER_NOTIFICATION_RECEIVED_SUBSCRIPTION = gql`
  subscription cuberNotificationReceived {
    cuberNotificationReceived {
      ... on RoomInvitationNotification {
        initiator {
          ...CuberBasic
        }
        target {
          ...CuberBasic
        }
        room {
          ...RoomBasic
        }
        created_at
      }
      ... on FollowerReceivedNotification {
        initiator {
          ...CuberBasic
        }
        target {
          ...CuberBasic
        }
        created_at
      }
      ... on FollowsJoinedRoomNotification {
        initiator {
          ...CuberBasic
        }
        target {
          ...CuberBasic
        }
        room {
          ...RoomBasic
        }
        created_at
      }
    }
  }
  ${cuberBasicFragment}
  ${roomBasicFragment}
`
