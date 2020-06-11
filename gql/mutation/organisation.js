import gql from 'graphql-tag'
import { organisationFragment } from '~/gql/fragments.js'

export const CREATE_ORGANISATION_MUTATION = gql`
  mutation createOrganisation(
    $name: String!
    $website: String
    $logo: String
    $email: String
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
