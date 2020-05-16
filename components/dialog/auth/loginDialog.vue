<template>
  <v-dialog v-model="status" max-width="600px" @click:outside="close()">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>{{ loginMode ? "Login" : "Register" }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text @click="goToWcaAuth()">
        <img src="~static/WCAlogo_notext.svg" alt="" style="width: 32px;" class="pr-2">
        WCA Login
      </v-btn>
      <v-btn text @click="loginMode = !loginMode">{{ loginMode ? "Register" : "Login" }}</v-btn>
    </v-toolbar>
    <LoginInterface v-if="loginMode" @login-success="close()"></LoginInterface>
    <RegisterInterface v-else @login-success="close()"></RegisterInterface>
  </v-dialog>
</template>

<script>
import authService from '~/services/auth.js';
import sharedService from '~/services/shared.js';
import LoginInterface from '~/components/interface/auth/loginInterface.vue';
import RegisterInterface from '~/components/interface/auth/registerInterface.vue';

export default {
  components: {
    LoginInterface,
    RegisterInterface
  },

  data() {
    return {
      loginMode: true,
    };
  },

  props: {
    status: {
      type: Boolean
    },
    redirectRoute: {}
  },

  methods: {
    goToWcaAuth() {
      authService.goToWcaAuth(this.redirectRoute);
    },

    close() {
      this.$emit('close');
    },

    reset() {
      this.loginMode = true;
    }
  },

  watch: {
    status(val) {
      if(this.status) {
        this.reset();
      }
    },
  },
}
</script>