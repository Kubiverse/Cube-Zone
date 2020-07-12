import gql from 'graphql-tag'
import {
  roomFragment,
  eventFragment,
  cuberBasicFragment,
  roomBasicFragment,
  solveFragment,
} from '~/gql/fragments.js'

export const CREATE_ROOM_MUTATION = gql`
  mutation createRoom(
    $name: String!
    $description: String
    $time_limit: Milliseconds
    $time_target: Milliseconds
    $max_capacity: Int
    $is_public: Boolean
    $event_id: ID!
    $attachAccumulators: [AccumulatorPair]
    $secret: String
  ) {
    createRoom(
      input: {
        name: $name
        description: $description
        time_limit: $time_limit
        time_target: $time_target
        max_capacity: $max_capacity
        is_public: $is_public
        event_id: $event_id
        attachAccumulators: $attachAccumulators
        secret: $secret
      }
    ) {
      ...Room
      event {
        ...Event
      }
      creator {
        ...CuberBasic
      }
    }
  }
  ${roomFragment}
  ${eventFragment}
  ${cuberBasicFragment}
`

export const DELETE_ROOM_MUTATION = gql`
  mutation deleteRoom($id: ID!) {
    deleteRoom(id: $id) {
      id
    }
  }
`

export const JOIN_ROOM_MUTATION = gql`
  mutation joinRoom(
    $room_id: ID!
    $secret: String
    $participationType: CuberRoomRelationTypeEnum
  ) {
    joinRoom(
      id: $room_id
      secret: $secret
      participationType: $participationType
    ) {
      id
    }
  }
`

export const LEAVE_ROOM_MUTATION = gql`
  mutation leaveRoom($room_id: ID!) {
    leaveRoom(id: $room_id) {
      id
    }
  }
`

export const UPDATE_ROOM_MUTATION = gql`
  mutation updateRoom(
    $id: ID!
    $name: String!
    $description: String
    $time_limit: Milliseconds
    $time_target: Milliseconds
    $max_capacity: Int
  ) {
    updateRoom(
      input: {
        id: $id
        name: $name
        description: $description
        time_limit: $time_limit
        time_target: $time_target
        max_capacity: $max_capacity
      }
    ) {
      ...Room
      event {
        ...Event
      }
      creator {
        ...CuberBasic
      }
    }
  }
  ${roomFragment}
  ${eventFragment}
  ${cuberBasicFragment}
`

export const GRANT_ROOM_MANAGEMENT_TO_CUBER_MUTATION = gql`
  mutation grantRoomManagementToCuber($room_id: ID!, $cuber_id: ID!) {
    grantRoomManagementToCuber(room_id: $room_id, cuber_id: $cuber_id) {
      manager {
        ...CuberBasic
      }
    }
  }
  ${cuberBasicFragment}
`

export const UNTRACK_SOLVES_FROM_ROOM_MUTATION = gql`
  mutation untrackSolvesFromRoom($room_id: ID!) {
    untrackSolvesFromRoom(room_id: $room_id) {
      id
    }
  }
`

export const NEXT_ROUND_MUTATION = gql`
  mutation nextRound($room_id: ID!) {
    nextRound(room_id: $room_id) {
      id
    }
  }
`

export const SEND_ROOM_CHAT_MESSAGE_MUTATION = gql`
  mutation sendRoomChatMessage($room_id: ID!, $message: String!) {
    sendRoomChatMessage(room_id: $room_id, message: $message) {
      user {
        ...CuberBasic
      }
      message
    }
  }
  ${cuberBasicFragment}
`

export const INVITE_CUBER_MUTATION = gql`
  mutation inviteCuber($room_id: ID!, $cuber_id: ID!) {
    inviteCuber(room_id: $room_id, cuber_id: $cuber_id) {
      cuber {
        ...CuberBasic
      }
      room {
        ...RoomBasic
      }
    }
  }
  ${cuberBasicFragment}
  ${roomBasicFragment}
`

export const UPDATE_SOLVE_MUTATION = gql`
  mutation updateSolve(
    $solve_id: ID!
    $state: SolveState
    $time: Milliseconds
    $penalties: Milliseconds
    $is_dnf: Boolean
    $is_tracked: Boolean
  ) {
    updateSolve(
      input: {
        id: $solve_id
        state: $state
        time: $time
        penalties: $penalties
        is_dnf: $is_dnf
        is_tracked: $is_tracked
      }
    ) {
      ...Solve
      cuber {
        ...CuberBasic
      }
    }
  }
  ${solveFragment}
  ${cuberBasicFragment}
`

export const CHANGE_ROOM_STATUS_MUTATION = gql`
  mutation changeRoomStatus(
    $room_id: ID!
    $participationType: CuberRoomRelationTypeEnum
  ) {
    changeRoomStatus(room_id: $room_id, participationType: $participationType) {
      id
    }
  }
`
