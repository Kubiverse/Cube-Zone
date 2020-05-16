<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <v-flex
        xs12
        sm8
        md4
      >
        <v-toolbar
          color="primary"
          dark
          flat
        >
          <v-toolbar-title>Login</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="goToWcaAuth()">
            <img src="../static/WCAlogo_notext.svg" alt="" style="width: 32px;" class="pr-2">
            WCA Login
          </v-btn>
          <v-btn text nuxt to="/register">Register</v-btn>
        </v-toolbar>
        <LoginInterface @login-success="handleLoginSuccess"></LoginInterface>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import authService from '~/services/auth.js';
import LoginInterface from '~/components/interface/auth/loginInterface.vue';

export default {
  middleware: "router-auth",
  components: {
    LoginInterface
  },

  head () {
    return {
      title: "Login"
    }
  },

  data() {
    return {
    };
  },

  methods: {
    goToWcaAuth: authService.goToWcaAuth,

    handleLoginSuccess() {
      this.$router.push("/");
    },
  }
}
</script>
