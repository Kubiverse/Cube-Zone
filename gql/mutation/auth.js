import gql from 'graphql-tag'
import {
  cuberFragment,
 } from '~/gql/fragments.js'

export const SOCIAL_LOGIN_MUTATION = gql`
  mutation socialLogin($provider:String!, $token:String!) {
    socialLogin(input: {
      provider: $provider,
      token: $token
    }) {
      access_token
      refresh_token
      expires_in
      token_type
      user {
        ...Cuber
      }
    }
  }
  ${cuberFragment}
`

export const LOGIN_MUTATION = gql`
  mutation login($email:Email!, $password:String!) {
    login(input: {
      username: $email,
      password: $password
    }) {
      access_token
      refresh_token
      expires_in
      token_type
      user {
        ...Cuber
      }
    }
  }
  ${cuberFragment}
`

export const REGISTER_MUTATION = gql`
  mutation register($first_name:String!, $last_name:String!, $email:Email!, $password:String!, $password_confirmation:String!) {
    register(input: {
      first_name: $first_name,
      last_name: $last_name,
      email: $email,
      password: $password,
      password_confirmation: $password_confirmation
    }) {
      access_token
      refresh_token
      expires_in
      token_type 
      user {
        ...Cuber
      }   
    }
  }
  ${cuberFragment}
`

export const LOGOUT_MUTATION = gql`
  mutation {
    logout {
      status
      message
    }
  }
`

export const UPDATE_FORGOTTEN_PASSWORD_MUTATION = gql`
  mutation updateForgottenPassword($email:Email!, $token: String!, $password: String!, $password_confirmation: String!) {
    updateForgottenPassword(input: {
      email: $email,
      token: $token,
      password: $password,
      password_confirmation: $password_confirmation
    }) {
      status
      message
    }
  }
`

export const FORGOT_PASSWORD_MUTATION = gql`
mutation forgotPassword($email:Email!) {
  forgotPassword(input: {
    email: $email
  }) {
    status,
    message
  }
}
`