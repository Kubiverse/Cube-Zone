<template>
  <v-menu
    v-model="status"
    :close-on-content-click="false"
    :width="300"
    offset-x
  >
    <template v-slot:activator="{ on }">
      <v-chip v-if="chip && selectedItem" v-on="on">
        <v-avatar left>
          <v-img v-if="selectedItem.avatar" :src="selectedItem.avatar" />
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
        {{ selectedItem.name }}
      </v-chip>
      <a v-else-if="selectedItem" v-on="on">
        <v-avatar size="24" class="mr-1">
          <v-img v-if="selectedItem.avatar" :src="selectedItem.avatar" />
          <v-icon v-else>mdi-account</v-icon>
        </v-avatar>
        {{ selectedItem.name }}
      </a>
    </template>

    <v-card>
      <v-list>
        <v-list-item>
          <v-list-item-avatar>
            <img v-if="selectedItem.avatar" :src="selectedItem.avatar" />
            <v-icon v-else>mdi-account</v-icon>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-progress-linear
              v-if="$apollo.queries.cuber.loading"
              indeterminate
            ></v-progress-linear>
            <template v-else-if="cuber">
              <v-list-item-title>{{ cuber.name }}</v-list-item-title>
              <v-list-item-subtitle
                >WCA ID:
                <a @click="goToWcaProfile(cuber.wca_id)">{{
                  cuber.wca_id
                }}</a></v-list-item-subtitle
              >
              <v-list-item-subtitle
                >Nationality:
                {{ countriesMap[cuber.nationality] }}</v-list-item-subtitle
              >
            </template>
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <v-divider></v-divider>

      <v-card-actions>
        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="openCuberLookupDialog()">
              <v-icon>mdi-badge-account-horizontal</v-icon>
            </v-btn>
          </template>
          <span>View Recent Solves</span>
        </v-tooltip>

        <v-tooltip bottom>
          <template v-slot:activator="{ on }">
            <v-btn icon v-on="on" @click="openCuberProfile()">
              <v-icon>mdi-open-in-new</v-icon>
            </v-btn>
          </template>
          <span>Go to Profile</span>
        </v-tooltip>
        <v-spacer></v-spacer>
        <template v-if="cuber">
          <v-btn
            color="primary"
            :loading="loading.toggleFollow"
            @click="toggleFollowCuber(!cuber.is_followed_by_you)"
            >{{ cuber.is_followed_by_you ? 'Un-Follow' : 'Follow' }}</v-btn
          >
        </template>
      </v-card-actions>
    </v-card>
  </v-menu>
</template>

<script>
import sharedService from '~/services/shared.js'
import { countriesMap } from '~/services/constants.js'
import { CUBER_PROFILE_QUERY } from '~/gql/query/cuber.js'
import {
  FOLLOW_CUBER_MUTATION,
  UNFOLLOW_CUBER_MUTATION,
} from '~/gql/mutation/cuber.js'

export default {
  props: {
    selectedItem: {},
    chip: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      countriesMap,
      status: false,
      cuber: null,

      loading: {
        toggleFollow: false,
      },
    }
  },

  apollo: {
    cuber: {
      query: CUBER_PROFILE_QUERY,
      variables() {
        return {
          id: this.selectedItem.id,
        }
      },
      skip: true,
    },
  },

  watch: {
    status(val) {
      if (val) {
        this.$apollo.queries.cuber.skip = false
      } else {
        this.$apollo.queries.cuber.skip = true
      }
    },
  },

  methods: {
    goToWcaProfile: sharedService.goToWcaProfile,

    async toggleFollowCuber(follow = true) {
      this.loading.toggleFollow = true
      try {
        await this.$apollo.mutate({
          mutation: follow ? FOLLOW_CUBER_MUTATION : UNFOLLOW_CUBER_MUTATION,
          variables: {
            id: this.selectedItem.id,
          },
          fetchPolicy: 'no-cache',
        })

        //this.cuber.is_followed_by_you = data.unfollowCuber.is_followed_by_you;
        this.cuber.is_followed_by_you = follow

        sharedService.generateSnackbar(
          this.$root,
          'Cuber ' + (follow ? '' : 'un-') + 'followed',
          'success',
        )
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.toggleFollow = false
    },

    openCuberProfile() {
      let routeData = this.$router.resolve({
        name: 'cuber',
        query: { id: this.selectedItem.id },
      })
      window.open(routeData.href, '_blank')
    },

    openCuberLookupDialog() {
      this.$root.$emit('cuber-lookup', this.cuber)
    },
  },
}
</script>
