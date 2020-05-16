import gql from 'graphql-tag'
import {
  cuberFragment,
 } from '~/gql/fragments.js'

export const UPDATE_CUBER_MUTATION = gql`
  mutation updateCuber($id:ID!, $nationality:CountryEnum, $first_name:String, $last_name:String) {
    updateCuber(input: {
      id: $id,
      nationality: $nationality,
      first_name: $first_name,
      last_name: $last_name
    }) {
      ...Cuber
    }
  }
  ${cuberFragment}
`

export const FOLLOW_CUBER_MUTATION = gql`
  mutation followCuber($id:ID) {
    followCuber(id: $id) {
      id
      is_followed_by_you
    }
  }
`

export const UNFOLLOW_CUBER_MUTATION = gql`
  mutation unfollowCuber($id:ID) {
    unfollowCuber(id: $id) {
      id
      is_followed_by_you
    }
  }
`

export const IDLE_MUTATION = gql`
  mutation idle {
    idle {
      id
    }
  }
`
