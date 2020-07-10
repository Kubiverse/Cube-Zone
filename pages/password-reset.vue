<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>Reset Password</v-toolbar-title>
            <v-spacer></v-spacer>
            <Button variant="text" nuxt to="/login">Login</Button>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="inputs.email"
              label="Email"
              name="email"
              prepend-icon="mdi-account"
              type="text"
            ></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <Button :disabled="loading.submitting" @click="handleSubmit()"
              >Reset Password</Button
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { FORGOT_PASSWORD_MUTATION } from '~/gql/mutation/auth.js'
import sharedService from '~/services/shared.js'
import Button from '~/components/shared/button.vue'

export default {
  middleware: 'router-auth',

  components: { Button },

  data() {
    return {
      inputs: {
        email: '',
      },

      loading: {
        submitting: false,
      },
    }
  },

  methods: {
    async handleSubmit() {
      this.loading.submitting = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: FORGOT_PASSWORD_MUTATION,
          variables: this.inputs,
        })

        this.$notifier.showSnackbar({
          message: data.forgotPassword.message,
          variant: 'success',
        })
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitting = false
    },
  },

  head() {
    return {
      title: 'Reset Password',
    }
  },
}
</script>
