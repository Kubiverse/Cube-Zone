import gql from 'graphql-tag'
import { organisationFragment } from '~/gql/fragments.js'

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

export const ORGANISATION_BASIC_QUERY = gql`
  query organisation($id: ID!) {
    organisation(id: $id) {
      ...Organisation
    }
  }
  ${organisationFragment}
`

export const ORGANISATIONS_QUERY = gql`
  query organisations($first: Int, $page: Int) {
    organisations(first: $first, page: $page) {
      paginatorInfo {
        count
        total
      }
      data {
        ...Organisation
      }
    }
  }
  ${organisationFragment}
`
