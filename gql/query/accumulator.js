import gql from 'graphql-tag'

export const ACCUMULATORS_QUERY = gql`
  query {
    accumulators {
      paginatorInfo {
        total
      }
      data {
        id
        name
      }
    }
  }
`
