import gql from 'graphql-tag'
import {
  cuberFragment,
  cuberBasicFragment,
  roomFragment,
  eventFragment,
} from '~/gql/fragments.js'

export const CUBER_PROFILE_QUERY = gql`
  query cuber($id: ID!) {
    cuber(id: $id) {
      ...Cuber
      active_room {
        id
        name
      }
      is_followed_by_you
    }
  }
  ${cuberFragment}
`

export const CUBER_FOLLOWERS_QUERY = gql`
  query cuber($id: ID!, $first: Int!, $page: Int) {
    cuber(id: $id) {
      id
      followers(first: $first, page: $page) {
        paginatorInfo {
          count
          total
        }
        data {
          ...CuberBasic
        }
      }
    }
  }
  ${cuberBasicFragment}
`

export const CUBER_FOLLOWS_QUERY = gql`
  query cuber($id: ID!, $first: Int!, $page: Int) {
    cuber(id: $id) {
      id
      follows(first: $first, page: $page) {
        paginatorInfo {
          count
          total
        }
        data {
          ...CuberBasic
        }
      }
    }
  }
  ${cuberBasicFragment}
`

export const CUBER_ROOMS_QUERY = gql`
  query cuber(
    $id: ID!
    $first: Int!
    $page: Int
    $sorting: [RoomsSortingEnum]
  ) {
    cuber(id: $id) {
      id
      rooms(first: $first, page: $page, sorting: $sorting) {
        paginatorInfo {
          count
          total
        }
        data {
          ...Room
          event {
            ...Event
          }
          creator {
            ...CuberBasic
          }
        }
      }
    }
  }
  ${eventFragment}
  ${roomFragment}
  ${cuberBasicFragment}
`

export const ME_QUERY = gql`
  query {
    me {
      ...Cuber
    }
  }
  ${cuberFragment}
`
