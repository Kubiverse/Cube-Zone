import gql from 'graphql-tag'
import { competitionFragment } from '~/gql/fragments.js'

export const ROOM_QUERY = gql`
  query room($id: ID!) {
    room(id: $id) {
      ...Room
      event {
        ...Event
      }
      creator {
        ...CuberBasic
      }
      manager {
        ...CuberBasic
      }
      active_cubers(first: 10) {
        data {
          ...CuberBasic
          pivot {
            type
          }
        }
      }
      spectating_cubers(first: 10) {
        paginatorInfo {
          total
        }
        data {
          ...CuberBasic
        }
      }
      pivot {
        type
      }
    }
  }
`

export const COMPETITION_BASIC_QUERY = gql`
  query competition($id: ID!) {
    competition(id: $id) {
      ...Competition
    }
  }
  ${competitionFragment}
`

export const COMPETITIONS_QUERY = gql`
  query competitions(
    $first: Int
    $page: Int
    $sorting: [CompetitionSortingEnum!]
    $is_featured: Boolean
    $is_invitational: Boolean
    $requires_signup: Boolean
  ) {
    competitions(
      sorting: $sorting
      is_featured: $is_featured
      is_invitational: $is_invitational
      requires_signup: $requires_signup
      first: $first
      page: $page
    ) {
      paginatorInfo {
        count
        total
      }
      data {
        ...Competition
      }
    }
  }
  ${competitionFragment}
`
