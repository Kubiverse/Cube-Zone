<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
          <Button variant="text" @click="goToWcaAuth()">
            <img
              src="../static/WCAlogo_notext.svg"
              alt=""
              style="width: 32px;"
              class="pr-2"
            />
            WCA Login
          </Button>
          <Button variant="text" nuxt to="/login">Login</Button>
        </v-toolbar>
        <RegisterInterface
          @login-success="handleLoginSuccess"
        ></RegisterInterface>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import authService from '~/services/auth.js'
import RegisterInterface from '~/components/interface/auth/registerInterface.vue'
import Button from '~/components/shared/button.vue'

export default {
  middleware: 'router-auth',

  components: {
    RegisterInterface,
    Button,
  },

  data() {
    return {}
  },

  methods: {
    goToWcaAuth: authService.goToWcaAuth,

    handleLoginSuccess() {
      this.$router.push('/')
    },
  },

  head() {
    return {
      title: 'Register',
    }
  },
}
</script>
