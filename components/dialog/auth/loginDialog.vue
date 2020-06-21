<template>
  <v-dialog v-model="status" max-width="600px" @click:outside="close()">
    <v-toolbar color="primary" dark flat>
      <v-toolbar-title>{{ loginMode ? 'Login' : 'Register' }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <Button variant="text" @click="goToWcaAuth()">
        <img
          src="~static/WCAlogo_notext.svg"
          alt=""
          style="width: 32px;"
          class="pr-2"
        />
        WCA Login
      </Button>
      <Button variant="text" @click="loginMode = !loginMode">{{
        loginMode ? 'Register' : 'Login'
      }}</Button>
    </v-toolbar>
    <LoginInterface v-if="loginMode" @login-success="close()"></LoginInterface>
    <RegisterInterface v-else @login-success="close()"></RegisterInterface>
  </v-dialog>
</template>

<script>
import authService from '~/services/auth.js'
import LoginInterface from '~/components/interface/auth/loginInterface.vue'
import RegisterInterface from '~/components/interface/auth/registerInterface.vue'
import Button from '~/components/shared/button.vue'

export default {
  components: {
    LoginInterface,
    RegisterInterface,
    Button,
  },

  props: {
    status: {
      type: Boolean,
    },
    redirectRoute: {},
  },

  data() {
    return {
      loginMode: true,
    }
  },

  watch: {
    status(_val) {
      if (this.status) {
        this.reset()
      }
    },
  },

  methods: {
    goToWcaAuth() {
      authService.goToWcaAuth(this.redirectRoute)
    },

    close() {
      this.$emit('close')
    },

    reset() {
      this.loginMode = true
    },
  },
}
</script>
