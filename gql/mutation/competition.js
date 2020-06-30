import gql from 'graphql-tag'
import {
  competitionFragment,
  competitionRoundFragment,
  roomBasicFragment,
} from '~/gql/fragments.js'

export const CREATE_COMPETITION_MUTATION = gql`
  mutation createCompetition(
    $name: String!
    $description: String!
    $start_date: Date!
    $end_date: Date
    $is_featured: Boolean
    $requires_signup: Boolean
    $is_invitational: Boolean
    $organisation_id: ID
    $room_configuration_id: ID
  ) {
    createCompetition(
      input: {
        name: $name
        description: $description
        start_date: $start_date
        end_date: $end_date
        is_featured: $is_featured
        requires_signup: $requires_signup
        is_invitational: $is_invitational
        organisation_id: $organisation_id
        room_configuration_id: $room_configuration_id
      }
    ) {
      ...Competition
    }
  }
  ${competitionFragment}
`

export const UPDATE_COMPETITION_MUTATION = gql`
  mutation updateCompetition(
    $id: ID!
    $name: String
    $description: String
    $start_date: Date
    $end_date: Date
    $is_featured: Boolean
    $requires_signup: Boolean
    $is_invitational: Boolean
  ) {
    updateCompetition(
      input: {
        id: $id
        name: $name
        description: $description
        start_date: $start_date
        end_date: $end_date
        is_featured: $is_featured
        requires_signup: $requires_signup
        is_invitational: $is_invitational
      }
    ) {
      ...Competition
    }
  }
  ${competitionFragment}
`

export const ADD_COMPETITION_ROUND = gql`
  mutation addCompetitionRound($competition_id: ID!, $event_id: ID!) {
    addCompetitionRound(competition_id: $competition_id, event_id: $event_id) {
      ...CompetitionRound
      event {
        id
        name
      }
    }
  }
  ${competitionRoundFragment}
`

export const UPDATE_COMPETITION_ROUND = gql`
  mutation updateCompetitionRound(
    $id: ID!
    $room_configuration_id: ID
    $start_at: DateTime
  ) {
    updateCompetitionRound(
      input: {
        id: $id
        room_configuration_id: $room_configuration_id
        start_at: $start_at
      }
    ) {
      ...CompetitionRound
      event {
        id
        name
      }
    }
  }
  ${competitionRoundFragment}
`

export const REMOVE_COMPETITION_ROUND = gql`
  mutation removeCompetitionRound($competition_id: ID!, $event_id: ID!) {
    removeCompetitionRound(
      competition_id: $competition_id
      event_id: $event_id
    ) {
      ...CompetitionRound
      event {
        id
        name
      }
    }
  }
  ${competitionRoundFragment}
`

export const CREATE_ROOMS_FOR_COMPETITION_ROUND = gql`
  mutation createRoomsForCompetitionRound(
    $competition_round_id: ID!
    $quantity: Int!
  ) {
    createRoomsForCompetitionRound(
      competition_round_id: $competition_round_id
      quantity: $quantity
    ) {
      ...RoomBasic
    }
  }
  ${roomBasicFragment}
`
