import gql from 'graphql-tag'
import {
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
      accumulators {
        id
        name
        pivot_n
      }
    }
  }
  ${roomFragment}
  ${eventFragment}
  ${cuberBasicFragment}
`

export const ROOM_BASIC_QUERY = gql`
  query room($id: ID!) {
    room(id: $id) {
      ...Room
      event {
        ...Event
      }
    }
  }
  ${roomFragment}
  ${eventFragment}
`

export const ROOMS_QUERY = gql`
  query rooms(
    $first: Int
    $page: Int
    $sorting: [RoomsSortingEnum]
    $events: [ID]
    $is_active: Boolean
    $has_secret: Boolean
    $is_full: Boolean
  ) {
    rooms(
      first: $first
      page: $page
      sorting: $sorting
      events: $events
      is_active: $is_active
      has_secret: $has_secret
      is_full: $is_full
    ) {
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
  ${roomFragment}
  ${eventFragment}
  ${cuberBasicFragment}
`
