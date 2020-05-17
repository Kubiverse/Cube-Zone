import gql from 'graphql-tag'
import { eventFragment } from '~/gql/fragments.js'

export const EVENTS_QUERY = gql`
  query {
    events(first: 25, sorting: [NAME_ASC]) {
      data {
        ...Event
      }
    }
  }
  ${eventFragment}
`
