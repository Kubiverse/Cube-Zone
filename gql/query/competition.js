import gql from 'graphql-tag'
import {
  competitionFragment,
  organisationFragment,
  competitionRoundFragment,
  roomFragment,
  eventFragment,
  cuberBasicFragment,
} from '~/gql/fragments.js'

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
        organiser {
          ...Organisation
        }
      }
    }
  }
  ${competitionFragment}
  ${organisationFragment}
`

export const COMPETITION_ROUNDS_QUERY = gql`
  query competitionRounds(
    $first: Int
    $page: Int
    $sorting: [CompetitionRoundSortingEnum!]
    $is_final: Boolean
    $event_id: ID
    $competition_id: ID
  ) {
    competitionRounds(
      first: $first
      page: $page
      sorting: $sorting
      is_final: $is_final
      event_id: $event_id
      competition_id: $competition_id
    ) {
      paginatorInfo {
        count
        total
      }
      data {
        ...CompetitionRound
        event {
          id
          name
        }
      }
    }
  }
  ${competitionRoundFragment}
`

export const COMPETITION_ROUND_QUERY = gql`
  query competitionRound($id: ID) {
    competitionRound(id: $id) {
      ...CompetitionRound
      event {
        id
        name
      }
    }
  }
  ${competitionRoundFragment}
`

export const COMPETITION_ROUND_ROOMS_QUERY = gql`
  query competitionRound($id: ID!) {
    competitionRound(id: $id) {
      ...CompetitionRound
      event {
        id
        name
      }
      competition {
        ...Competition
      }
      rooms {
        ...Room
        event {
          ...Event
        }
        creator {
          ...CuberBasic
        }
        active_cubers(first: 3) {
          paginatorInfo {
            total
            count
          }
          data {
            ...CuberBasic
          }
        }
      }
    }
  }
  ${competitionRoundFragment}
  ${competitionFragment}
  ${roomFragment}
  ${eventFragment}
  ${cuberBasicFragment}
`
