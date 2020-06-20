import gql from 'graphql-tag'

export const accumulatedResultFragment = gql`
  fragment AccumulatedResult on AccumulatedResult {
    id
    result
    is_winner
    is_dnf
    contextualAccumulator {
      id: pivot_id
      name
      pivot_label
      type_id: id
      pivot_n
    }
  }
`

export const cuberBasicFragment = gql`
  fragment CuberBasic on Cuber {
    id
    name
    avatar
    nationality
  }
`

export const cuberFragment = gql`
  fragment Cuber on Cuber {
    id
    name
    first_name
    last_name
    display_name
    wca_id
    nationality
    avatar
    last_activity_at
  }
`

export const eventFragment = gql`
  fragment Event on Event {
    id
    name
    puzzle
    icon
  }
`

export const roomBasicFragment = gql`
  fragment RoomBasic on Room {
    id
    name
    created_at
  }
`

export const roomFragment = gql`
  fragment Room on Room {
    id
    name
    has_secret
    time_limit
    time_target
    max_capacity
    is_public
    is_active
    created_at
  }
`

export const roundBasicFragment = gql`
  fragment RoundBasic on Round {
    id
    round_number
    created_at
  }
`

export const scrambleFragment = gql`
  fragment Scramble on Scramble {
    id
    scramble
  }
`

export const solveFragment = gql`
  fragment Solve on Solve {
    id
    state
    result
    penalties
    is_dnf
    time
    is_winner
    is_tracked
  }
`

export const competitionFragment = gql`
  fragment Competition on Competition {
    id
    name
    description
    start_date
    end_date
    is_featured
    requires_signup
    is_invitational
    created_at
  }
`

export const competitionRoundFragment = gql`
  fragment CompetitionRound on CompetitionRound {
    id
    round_number
    is_final
    start_at
  }
`

export const organisationFragment = gql`
  fragment Organisation on Organisation {
    id
    name
    website
    logo
    email
  }
`
