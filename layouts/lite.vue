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
      <v-btn small text @click="toggleTheme()">Toggle Theme</v-btn>
      <a href="mailto:feedback@cube.zone" class="pl-2">
        feedback@cube.zone
      </a>
      <v-icon
        small
        class="pl-2"
        @click="goToLink('https://github.com/Kubiverse/Cube-Zone')"
        >mdi-github</v-icon
      >
      <v-icon
        small
        class="pl-2"
        @click="goToLink('https://www.facebook.com/CubeZone-115206463518382')"
        >mdi-facebook</v-icon
      >
      <a class="pl-2" @click="goToLink('https://discord.gg/J2v2eQN')">
        <v-icon small>mdi-discord</v-icon>
        Chat with us!
      </a>
    </v-footer>
    <Snackbar />
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import sharedService from '~/services/shared.js'
import Snackbar from '~/components/snackbar/snackbar'

export default {
  components: {
    Snackbar,
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
