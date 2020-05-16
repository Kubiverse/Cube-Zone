import gql from 'graphql-tag'
import { 
  roundBasicFragment,
  roomBasicFragment, 
  solveFragment, 
  cuberBasicFragment, 
  eventFragment,
  accumulatedResultFragment
} from '~/gql/fragments.js'

export const ACCUMULATED_RESULT_QUERY = gql`
  query accumulatedResult($id:ID!, $first:Int!, $page: Int) {
    accumulatedResult(id: $id) {
      ...AccumulatedResult
      cuber {
        ...CuberBasic
      }
      room {
        ...RoomBasic
      }
      solves(first: $first, page: $page) {
        paginatorInfo {
          count
          total
        }
        data {
          ...Solve
          created_at
          cuber {
            ...CuberBasic
          }
          event {
            ...Event
          }
          round {
            ...RoundBasic
          }
          room {
            ...RoomBasic
          }
        }
      }
    }
  }
  ${roundBasicFragment}
  ${roomBasicFragment}
  ${solveFragment}
  ${cuberBasicFragment}
  ${eventFragment}
  ${accumulatedResultFragment}
`