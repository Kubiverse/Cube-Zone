import gql from 'graphql-tag'
import {
  cuberBasicFragment,
  roomFragment,
  roundBasicFragment,
  accumulatedResultFragment,
  scrambleFragment,
  eventFragment,
  solveFragment,
} from '~/gql/fragments.js'

export const ROOM_MEMBERS_UPDATED_SUBSCRIPTION = gql`
  subscription roomMembersUpdated($room_id: ID!) {
    roomMembersUpdated(room_id: $room_id) {
      ...CuberBasic
      pivot {
        type
        last_activity_at
      }
    }
  }
  ${cuberBasicFragment}
`

export const ROOM_UPDATED_SUBSCRIPTION = gql`
  subscription roomUpdated($room_id: ID!) {
    roomUpdated(room_id: $room_id) {
      ...Room
      manager {
        ...CuberBasic
      }
    }
  }
  ${roomFragment}
  ${cuberBasicFragment}
`

export const ROOM_CHAT_MESSAGE_RECEIVED_SUBSCRIPTION = gql`
  subscription roomChatMessageReceived($room_id: ID!) {
    roomChatMessageReceived(room_id: $room_id) {
      user {
        ...CuberBasic
      }
      message
    }
  }
  ${cuberBasicFragment}
`

export const ROUND_STARTED_SUBSCRIPTION = gql`
  subscription roundStarted($room_id: ID!) {
    roundStarted(room_id: $room_id) {
      ...RoundBasic
      scramble {
        ...Scramble
        event {
          ...Event
        }
      }
      solves {
        ...Solve
        cuber {
          ...CuberBasic
          pivot {
            type
            last_activity_at
          }
        }
      }
      accumulated_results {
        ...AccumulatedResult
      }
    }
  }
  ${roundBasicFragment}
  ${accumulatedResultFragment}
  ${scrambleFragment}
  ${eventFragment}
  ${solveFragment}
  ${cuberBasicFragment}
`

export const ROUND_FINISHED_SUBSCRIPTION = gql`
  subscription roundFinished($room_id: ID!) {
    roundFinished(room_id: $room_id) {
      ...RoundBasic
      accumulated_results {
        ...AccumulatedResult
        cuber {
          ...CuberBasic
        }
      }
    }
  }
  ${cuberBasicFragment}
  ${roundBasicFragment}
  ${accumulatedResultFragment}
`

export const SOLVE_UPDATED_SUBSCRIPTION = gql`
  subscription solveUpdated($room_id: ID!) {
    solveUpdated(room_id: $room_id) {
      ...Solve
      cuber {
        ...CuberBasic
      }
    }
  }
  ${solveFragment}
  ${cuberBasicFragment}
`

//not real subscription
export const ROOM_MEMBER_STATUS_UPDATED_SUBSCRIPTION = gql`
  subscription roomMemberStatusUpdated($room_id: ID!) {
    roomMemberStatusUpdated(room_id: $room_id) {
      type
      last_activity_at
      cuber {
        ...CuberBasic
      }
    }
  }
  ${cuberBasicFragment}
`
