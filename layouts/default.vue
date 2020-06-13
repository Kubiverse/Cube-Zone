<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
    >
      <nuxt-link to="/">
        <v-img
          v-if="miniVariant"
          :src="require('../static/cubezone2-square.png')"
          class="pa-2"
        />
        <v-img
          v-else
          class="ma-2"
          :src="require('../static/cubezone2-rect.png')"
        />
      </nuxt-link>
      <v-divider></v-divider>
      <v-list class="pt-0">
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item key="-1" @click="miniVariant = !miniVariant">
            <v-list-item-action>
              <v-icon v-if="miniVariant">mdi-chevron-right</v-icon>
            </v-list-item-action>
            <v-list-item-content></v-list-item-content>
            <v-list-item-action>
              <v-btn icon @click.stop="miniVariant = !miniVariant">
                <v-icon>mdi-chevron-left</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
          <client-only>
            <template v-if="user">
              <v-list-item
                key="-3"
                @click="cuberNotificationStatus = !cuberNotificationStatus"
              >
                <v-list-item-action>
                  <v-badge
                    :content="messagesCount"
                    :value="messagesCount"
                    color="red"
                    overlap
                  >
                    <v-icon>{{
                      cuberNotificationStatus
                        ? 'mdi-bell-check'
                        : 'mdi-bell-cancel'
                    }}</v-icon>
                  </v-badge>
                </v-list-item-action>
                <v-list-item-content>
                  {{ messagesCount }} Notifications
                </v-list-item-content>
              </v-list-item>
              <v-list-item
                v-if="organisation"
                key="-5"
                to="/organisations"
                router
                exact
              >
                <v-list-item-action>
                  <v-img
                    v-if="organisation && organisation.logo"
                    :src="organisation.logo"
                    height="24"
                    width="24"
                    contain
                  />
                  <v-icon v-else>mdi-domain</v-icon>
                </v-list-item-action>
                <v-list-item-content>
                  <v-list-item-title>
                    <span v-if="organisation">{{ organisation.name }}</span>
                    <i v-else>No Organisation</i>
                  </v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-menu
                :close-on-content-click="true"
                :max-width="300"
                offset-x
                top
              >
                <template v-slot:activator="{ on }">
                  <v-list-item key="-2" v-on="on">
                    <v-list-item-action>
                      <v-img
                        v-if="user.avatar"
                        :src="user.avatar"
                        height="24"
                        width="24"
                        contain
                      />
                      <v-icon v-else>mdi-account</v-icon>
                    </v-list-item-action>
                    <v-list-item-content>
                      <v-list-item-title>{{ user.name }}</v-list-item-title>
                      <v-list-item-subtitle>{{
                        user.wca_id
                      }}</v-list-item-subtitle>
                    </v-list-item-content>
                  </v-list-item>
                </template>

                <v-card>
                  <v-list>
                    <v-list-item>
                      <v-list-item-avatar>
                        <v-img v-if="user.avatar" :src="user.avatar" />
                        <v-icon v-else>mdi-account</v-icon>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ user.name }}</v-list-item-title>
                        <v-list-item-subtitle
                          >WCA ID: {{ user.wca_id }}</v-list-item-subtitle
                        >
                        <v-list-item-subtitle
                          >Nationality:
                          {{
                            countriesMap[user.nationality]
                          }}</v-list-item-subtitle
                        >
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>

                  <v-divider></v-divider>

                  <v-list dense>
                    <v-list-item
                      :key="-1"
                      :to="currentUserProfileRoute"
                      exact
                      nuxt
                    >
                      <v-list-item-content>
                        <v-list-item-title>My Profile Page</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>

                    <v-list-item
                      v-for="(item, i) in accountItems"
                      :key="i"
                      :to="item.to"
                      :exact="item.exact"
                      nuxt
                    >
                      <v-list-item-content>
                        <v-list-item-title>{{ item.title }}</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-divider></v-divider>
                    <v-list-item @click="logout()">
                      <v-list-item-content>
                        <v-list-item-title>Logout</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-menu>
            </template>

            <div v-else>
              <v-list-item to="/login" router exact>
                <v-list-item-action>
                  <v-icon>mdi-login</v-icon>
                </v-list-item-action>
                <v-list-item-content>Login</v-list-item-content>
              </v-list-item>
            </div>
          </client-only>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-content>
      <nuxt />
    </v-content>
    <v-navigation-drawer v-model="rightDrawer" :right="right" temporary fixed>
      <v-list>
        <v-list-item @click.native="right = !right">
          <v-list-item-action>
            <v-icon light>
              mdi-repeat
            </v-icon>
          </v-list-item-action>
          <v-list-item-title>Switch drawer (click me)</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-footer app>
      <a @click="copyIdTokenToClipboard()">{{ getBuildInfo() }}</a>
      <span>&nbsp;&copy; {{ new Date().getFullYear() }}</span>
      <nuxt-link to="/legal/privacy" class="pl-2">
        Privacy Policy
      </nuxt-link>
      <nuxt-link to="/legal/terms" class="pl-2">
        Terms and Conditions
      </nuxt-link>
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
    <CuberNotificationSnackbar :status="cuberNotificationStatus" />
    <ViewCuberSolvesDialog
      :cuber="lookupCuber"
      :status="dialogs.viewCuberSolves"
      @close="dialogs.viewCuberSolves = false"
    ></ViewCuberSolvesDialog>
    <LoginDialog
      :status="dialogs.login"
      :redirect-route="loginRedirectRoute"
      @close="dialogs.login = false"
    ></LoginDialog>
  </v-app>
</template>

<script>
import { mapGetters } from 'vuex'
import sharedService from '~/services/shared.js'
import { countriesMap } from '~/services/constants.js'
import authService from '~/services/auth.js'
import { LOGOUT_MUTATION } from '~/gql/mutation/auth.js'
import { CUBER_NOTIFICATION_RECEIVED_SUBSCRIPTION } from '~/gql/subscription/cuber.js'
import ViewCuberSolvesDialog from '~/components/dialog/solve/viewCuberSolvesDialog'
import LoginDialog from '~/components/dialog/auth/loginDialog'
import Snackbar from '~/components/snackbar/snackbar'
import CuberNotificationSnackbar from '~/components/snackbar/cuberNotificationSnackbar'

export default {
  components: {
    ViewCuberSolvesDialog,
    Snackbar,
    CuberNotificationSnackbar,
    LoginDialog,
  },
  data() {
    return {
      countriesMap,
      dialogs: {
        viewCuberSolves: false,
        login: false,
      },
      lookupCuber: null,
      loginRedirectRoute: null,
      cuberNotificationStatus: true,
      clipped: false,
      drawer: true,
      fixed: false,
      items: [
        {
          icon: 'mdi-home',
          title: 'Home',
          to: '/',
        },
        {
          icon: 'mdi-google-classroom',
          title: 'All Rooms',
          to: '/rooms',
        },
        {
          icon: 'mdi-account-group',
          title: 'Competitions',
          to: '/competitions',
        },
        {
          icon: 'mdi-format-list-numbered',
          title: 'Global Stats',
          to: '/stats',
        },
      ],

      accountItems: [
        { title: 'My Recent Rooms', to: '/my-rooms', exact: false },
        { title: 'My Organisations', to: '/organisations', exact: false },
        { title: 'Settings', to: '/settings', exact: false },
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
      messagesCount: 'cuberNotification/messagesCount',
      organisation: 'organisation/current',
    }),

    currentUserProfileRoute() {
      return '/cuber?id=' + this.user.id
    },
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

    if (this.user) {
      this.subscribeToCuberNotifications()
    }
  },

  mounted() {},

  methods: {
    goToLink: sharedService.goToLink,

    toggleTheme() {
      if (process.client) {
        this.$vuetify.theme.dark = !this.$vuetify.theme.dark
        localStorage.setItem(
          'theme',
          this.$vuetify.theme.dark ? 'dark' : 'light',
        )
      }
    },

    async logout() {
      try {
        this.$router.push('/')

        await this.$apollo.mutate({
          mutation: LOGOUT_MUTATION,
          variables: {},
        })

        await authService.handleLogout(this)
      } catch (err) {
        sharedService.handleError(err, this.$root)
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

    subscribeToCuberNotifications() {
      //do the subscription
      this.$apollo.addSmartSubscription('cuberNotificationReceived', {
        query: CUBER_NOTIFICATION_RECEIVED_SUBSCRIPTION,
        result({ data }) {
          console.log(data)
          this.$store.commit(
            'cuberNotification/addMessage',
            data.cuberNotificationReceived,
          )
        },
      })
    },
  },
}
</script>
