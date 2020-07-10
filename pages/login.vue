<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-toolbar color="primary" dark flat>
          <v-toolbar-title>Login</v-toolbar-title>
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
          <Button variant="text" nuxt to="/register">Register</Button>
        </v-toolbar>
        <LoginInterface @login-success="handleLoginSuccess"></LoginInterface>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import authService from '~/services/auth.js'
import LoginInterface from '~/components/interface/auth/loginInterface.vue'
import Button from '~/components/shared/button.vue'

export default {
  middleware: 'router-auth',
  components: {
    LoginInterface,
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
      title: 'Login',
    }
  },
}
</script>
