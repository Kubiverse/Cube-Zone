<template>
  <v-app>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer app>
      <a @click="copyIdTokenToClipboard()"
        >{{ getBuildInfo() }} - Streamer Mode</a
      >
      <span>&nbsp;&copy; {{ new Date().getFullYear() }}</span>
      <v-spacer></v-spacer>
      <Button variant="text" small @click="toggleTheme()">Toggle Theme</Button>
      <a href="mailto:feedback@cube.zone" class="pl-2">
        feedback@cube.zone
      </a>
      <span>
        <v-img
          :src="require('../static/cubezone2-rect-lite.png')"
          height="30"
          width="195"
          class="ml-2"
        />
      </span>
    </v-footer>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import sharedService from '~/services/shared.js'
import Snackbar from '~/components/snackbar/snackbar'
import Button from '~/components/shared/button.vue'

export default {
  components: {
    Snackbar,
    Button,
  },
  data() {
    return {}
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      messagesCount: 'cuberNotification/messagesCount',
    }),
  },

  watch: {
    user(val) {
      if (val) {
        this.$notifier.showSnackbar({
          message: 'Login Success',
          variant: 'success',
        })

        this.subscribeToCuberNotifications()
      } else {
        this.$notifier.showSnackbar({
          message: 'User Logged Out',
          variant: 'warning',
        })
      }
    },
  },

  created() {
    this.$root.$on('cuber-lookup', (cuber) => {
      if (!cuber) return
      this.lookupCuber = cuber
      this.dialogs.viewCuberSolves = true
    })

    this.$root.$on('login-dialog', (route = null) => {
      this.loginRedirectRoute = route
      this.dialogs.login = true
    })
  },

  mounted() {},

  methods: {
    goToLink: sharedService.goToLink,

    toggleTheme() {
      if (process.client) {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
      }
    },

    getBuildInfo() {
      return (
        'Build ' +
        (process.env.VER ? process.env.VER + ' - ' : '') +
        process.env.build_date
      )
    },

    copyIdTokenToClipboard() {
      sharedService.copyToClipboard(this, this.$apolloHelpers.getToken())
    },
  },
}
</script>
