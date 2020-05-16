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
          <v-toolbar-title>Register</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-btn text @click="goToWcaAuth()">
            <img src="../static/WCAlogo_notext.svg" alt="" style="width: 32px;" class="pr-2">
            WCA Login
          </v-btn>
          <v-btn text nuxt to="/login">Login</v-btn>
        </v-toolbar>
        <RegisterInterface @login-success="handleLoginSuccess"></RegisterInterface>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import authService from '~/services/auth.js';
import RegisterInterface from '~/components/interface/auth/registerInterface.vue';

export default {
  middleware: "router-auth",

  components: {
    RegisterInterface
  },

  head() {
    return {
      title: "Register"
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
    }
  }
}
</script>
