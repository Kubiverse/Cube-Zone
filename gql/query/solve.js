import gql from 'graphql-tag'
import { 
  roundBasicFragment,
  roomBasicFragment, 
  solveFragment, 
  cuberBasicFragment, 
  eventFragment,
} from '~/gql/fragments.js'

export const SOLVES_QUERY = gql`
  query solves($first: Int, $page: Int, $cuber_id:ID, $event_id:ID, $sorting:[SolveSortingEnum!], $state: SolveState, $is_tracked: Boolean) {
    solves(first: $first, page: $page, sorting: $sorting, cuber_id: $cuber_id, event_id: $event_id, state: $state, is_tracked: $is_tracked) {
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
  ${roundBasicFragment}
  ${roomBasicFragment}
  ${solveFragment}
  ${cuberBasicFragment}
  ${eventFragment}
`
