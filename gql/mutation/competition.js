import gql from 'graphql-tag'
import { competitionFragment } from '~/gql/fragments.js'

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
