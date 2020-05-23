import gql from 'graphql-tag'
import {
  roundBasicFragment,
  scrambleFragment,
  roomBasicFragment,
  solveFragment,
  cuberBasicFragment,
  eventFragment,
  accumulatedResultFragment,
} from '~/gql/fragments.js'

export const ROUND_QUERY = gql`
  query round($id: ID!) {
    round(id: $id) {
      ...RoundBasic
      scramble {
        ...Scramble
        event {
          ...Event
        }
      }
      room {
        ...RoomBasic
      }
      solves {
        ...Solve
        cuber {
          ...CuberBasic
        }
      }
    }
  }
  ${roundBasicFragment}
  ${scrambleFragment}
  ${roomBasicFragment}
  ${solveFragment}
  ${cuberBasicFragment}
  ${eventFragment}
`

export const ROUNDS_QUERY = gql`
  query rounds(
    $first: Int
    $page: Int
    $sorting: [RoundSortingEnum!]
    $room_id: ID
  ) {
    rounds(first: $first, page: $page, sorting: $sorting, room_id: $room_id) {
      paginatorInfo {
        count
        total
      }
      data {
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
            }
          }
        }
        accumulated_results {
          ...AccumulatedResult
          cuber {
            ...CuberBasic
          }
          room {
            ...RoomBasic
          }
        }
      }
    }
  }
  ${roundBasicFragment}
  ${scrambleFragment}
  ${eventFragment}
  ${solveFragment}
  ${cuberBasicFragment}
  ${accumulatedResultFragment}
  ${roomBasicFragment}
`

export const ROUNDS_BASIC_QUERY = gql`
  query rounds(
    $first: Int
    $page: Int
    $sorting: [RoundSortingEnum!]
    $room_id: ID
  ) {
    rounds(first: $first, page: $page, sorting: $sorting, room_id: $room_id) {
      paginatorInfo {
        count
        total
      }
      data {
        ...RoundBasic
        scramble {
          ...Scramble
        }
        winning_solve {
          ...Solve
          cuber {
            ...CuberBasic
          }
        }
        solves {
          ...Solve
          cuber {
            ...CuberBasic
          }
        }
      }
    }
  }
  ${roundBasicFragment}
  ${scrambleFragment}
  ${solveFragment}
  ${cuberBasicFragment}
`
