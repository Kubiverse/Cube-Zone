import gql from 'graphql-tag'
import { organisationFragment } from '~/gql/fragments.js'

export const CREATE_ORGANISATION_MUTATION = gql`
  mutation createOrganisation(
    $name: String!
    $website: String!
    $logo: String!
    $email: Email!
  ) {
    createOrganisation(
      input: { name: $name, website: $website, logo: $logo, email: $email }
    ) {
      ...Organisation
    }
  }
  ${organisationFragment}
`

export const UPDATE_ORGANISATION_MUTATION = gql`
  mutation updateOrganisation(
    $id: ID!
    $name: String
    $website: String
    $logo: String
    $email: String
  ) {
    updateOrganisation(
      input: {
        id: $id
        name: $name
        website: $website
        logo: $logo
        email: $email
      }
    ) {
      ...Organisation
    }
  }
  ${organisationFragment}
`

export const ADD_MEMBER_TO_ORGANISATION = gql`
  mutation addMemberToOrganisation($organisation_id: ID!, $cuber_id: ID!) {
    addMemberToOrganisation(
      organisation_id: $organisation_id
      cuber_id: $cuber_id
    ) {
      id
    }
  }
`

export const REMOVE_MEMBER_FROM_ORGANISATION = gql`
  mutation removeMemberFromOrganisation($organisation_id: ID!, $cuber_id: ID!) {
    removeMemberFromOrganisation(
      organisation_id: $organisation_id
      cuber_id: $cuber_id
    ) {
      id
    }
  }
`


