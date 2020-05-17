<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Update Password</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text nuxt to="/login">Login</v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="inputs.email"
              label="Email"
              readonly
              name="email"
              prepend-icon="mdi-account"
              type="text"
            ></v-text-field>
            <v-text-field
              id="password"
              v-model="inputs.password"
              label="Password"
              name="password"
              prepend-icon="mdi-lock"
              type="password"
            ></v-text-field>
            <v-text-field
              id="passwordconfirm"
              v-model="inputs.password_confirmation"
              label="Password Confirmation"
              name="passwordconfirm"
              prepend-icon="mdi-lock"
              type="password"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :disabled="loading.submitting"
              @click="handleSubmit()"
              >Update Password</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { UPDATE_FORGOTTEN_PASSWORD_MUTATION } from '~/gql/mutation/auth.js'
import sharedService from '~/services/shared.js'

export default {
  components: {},

  data() {
    return {
      inputs: {
        email: null,
        token: null,
        password: '',
        password_confirmation: '',
      },

      loading: {
        submitting: false,
      },
    }
  },

  mounted() {
    if (!this.$route.query.token || !this.$route.query.email) {
      return this.$router.push('/')
    }

    this.inputs.email = this.$route.query.email
    this.inputs.token = this.$route.query.token
  },

  methods: {
    async handleSubmit() {
      this.loading.submitting = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_FORGOTTEN_PASSWORD_MUTATION,
          variables: this.inputs,
        })

        sharedService.generateSnackbar(
          this.$root,
          data.updateForgottenPassword.message,
          'success',
        )
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitting = false
    },
  },

  head() {
    return {
      title: 'Update Password',
    }
  },
}
</script>
