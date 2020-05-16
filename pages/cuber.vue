<template>
  <v-container v-if="cuber" fluid>
    <v-layout
      column
      justify-left
      align-left
    >
      <v-flex
        xs12
        sm8
        md6
      >
        <v-card class="mt-2">
          <v-toolbar flat color="accent">
            <v-toolbar-title>
              <v-avatar class="mr-1">
                <v-img v-if="cuber.avatar" :src="cuber.avatar" />
                <v-icon v-else>mdi-account</v-icon>
              </v-avatar>
              {{ cuber.name }}</v-toolbar-title>
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-btn color="primary" @click="toggleFollowCuber(!cuber.is_followed_by_you)" :loading="loading.toggleFollow">{{ cuber.is_followed_by_you ? "Un-Follow" : "Follow" }}</v-btn>
            <template v-if="cuber.wca_id">
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <img src="../static/WCAlogo_notext.svg" alt="" style="width: 32px;" class="pr-2">
              <span>WCA ID: <a @click="goToWcaProfile(cuber.wca_id)">{{ cuber.wca_id }}</a></span>
            </template>
            <template v-if="cuber.nationality">
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <span>Nationality: {{ countriesMap[cuber.nationality] }}</span>
            </template>
            <template v-if="cuber.active_room">
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <span>Currently Active In:
                <a @click="enterRoom(cuber.active_room)">{{ cuber.active_room.name }}</a>
              </span>
            </template>
            <template v-if="cuber.last_activity_at">
              <v-divider
                class="mx-4"
                inset
                vertical
              ></v-divider>
              <span>Last Activity:
                {{ generateMomentString(cuber.last_activity_at) }}
              </span>
            </template>
            <v-spacer></v-spacer>
            <v-btn icon @click="reset()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>
          <v-tabs
            v-model="tab"
          >
            <v-tab
              v-for="item in tabItems"
              :key="item.tab"
            >
              {{ item.title }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item key="solves">
              <v-row>
                <v-col cols="3">
                  <v-select
                    filled
                    dense
                    :items="events.data"
                    v-model="filterObject.event_id"
                    label="Event"
                    item-value="id"
                  >
                    <template slot="selection" slot-scope="data"> 
                      <EventLabel :event="data.item" />
                    </template>
                    <template slot="item" slot-scope="data"> 
                      <EventLabel :event="data.item" />
                    </template>
                  </v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    filled
                    dense
                    :items="booleanOptionsArray"
                    v-model="filterObject.is_tracked"
                    label="Is Tracked"
                    item-text="name"
                    item-value="id"
                    class="py-0"
                  ></v-select>
                </v-col>
              </v-row>
              <ViewCuberSolvesInterface :status="currentTab == 'solves'" :generation="generation.solves" :cuber="cuber" :filterObject="filterObject"></ViewCuberSolvesInterface>
            </v-tab-item>

            <v-tab-item key="rooms">
              <ViewCuberRoomsInterface :status="currentTab == 'rooms'" :generation="generation.solves" :cuber="cuber"></ViewCuberRoomsInterface>
            </v-tab-item>

            <v-tab-item key="follows">
              <ViewCuberFollowsInterface :status="currentTab == 'follows'" :generation="generation.solves" :cuber="cuber"></ViewCuberFollowsInterface>
            </v-tab-item>

            <v-tab-item key="followers">
              <ViewCuberFollowersInterface :status="currentTab == 'followers'" :generation="generation.solves" :cuber="cuber"></ViewCuberFollowersInterface>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
  <v-container v-else fill-height justify-center>
    <div v-if="errorMessage">
      <span class="display-1 pl-2">{{ errorMessage }}
      </span>
    </div>
    <div v-else>
      <span class="display-1 pl-2">Loading
        <v-progress-circular indeterminate></v-progress-circular>
      </span>
    </div>
  </v-container>
</template>

<script>
import sharedService from '~/services/shared.js';
import { countriesMap, booleanOptionsArray } from '~/services/constants.js';
import { CUBER_PROFILE_QUERY } from '~/gql/query/cuber.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import { FOLLOW_CUBER_MUTATION, UNFOLLOW_CUBER_MUTATION } from '~/gql/mutation/cuber.js'
import ViewCuberSolvesInterface from '~/components/interface/viewCuberSolvesInterface.vue';
import ViewCuberRoomsInterface from '~/components/interface/viewCuberRoomsInterface.vue';
import ViewCuberFollowersInterface from '~/components/interface/viewCuberFollowersInterface.vue';
import ViewCuberFollowsInterface from '~/components/interface/viewCuberFollowsInterface.vue';
import EventLabel from '~/components/shared/eventLabel.vue';

export default {
  head() {
    return {
      title: "Cuber Info"
    }
  },

  components: {
    ViewCuberSolvesInterface,
    ViewCuberRoomsInterface,
    ViewCuberFollowersInterface,
    ViewCuberFollowsInterface,
    EventLabel,
  },

  data() {
    return {
      countriesMap,
      booleanOptionsArray,
      cuber: null,
      events: {
        data: [
          { id: null, name: "Any" }
        ]
      },
      generation: {
        solves: 0,
        events: 0
      },

      loading: {
        loadCuber: false,
        toggleFollow: false
      },

      filterObject: {
        event_id: null,
        is_tracked: true
      },

      errorMessage: null,

      tab: null,
      tabItems: [
        { tab: 'solves', title: "Solves"},
        { tab: 'rooms', title: "Recent Rooms"},
        { tab: 'follows', title: "Follows"},
        { tab: 'followers', title: "Followers"},
      ],
    };
  },

  apollo: {
    events: {
      query: EVENTS_QUERY,

      manual: true,
      result({ data }) {
        if(++this.generation.events % 2 == 0) {
          this.events.data.push(...data.events.data);
        }
      },

      skip: true,
    }
  },

  mounted() {
    this.loadCuber();
  },

  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateMomentString: sharedService.generateMomentString,
    goToWcaProfile: sharedService.goToWcaProfile,

    enterRoom(room) {
      this.$router.push({
        path: "/room",
        query: {
          id: room.id
        }
      });
    },

    openDialog(dialogName) {
      if(dialogName in this.dialogs) {
        this.dialogs[dialogName] = true;
      }
    },

    async toggleFollowCuber(follow = true) {
      this.loading.toggleFollow = true;
      try {
        let { data } = await this.$apollo.mutate({
          mutation: follow ? FOLLOW_CUBER_MUTATION : UNFOLLOW_CUBER_MUTATION,
          variables: {
            id: this.cuber.id
          },
          fetchPolicy: 'no-cache'
        });

        //this.cuber.is_followed_by_you = data.unfollowCuber.is_followed_by_you;
        this.cuber.is_followed_by_you = follow;

        sharedService.generateSnackbar(this.$root, "Cuber " + (follow ? "" : "un-") + "followed", "success");
      } catch(err) {
        sharedService.handleError(err, this.$root);
      }
      this.loading.toggleFollow = false;
    },

    async loadCuber() {
      this.loading.loadCuber = true;
      try {
        if(!this.$route.query.id) {
          throw sharedService.generateError("Missing cuber ID");
        }

        let { data } = await this.$apollo.query({
          query: CUBER_PROFILE_QUERY,
          variables: {
            id: this.$route.query.id
          }
        });

        this.cuber = data.cuber;

        this.$apollo.queries.events.skip = false;
      } catch(err) {
        sharedService.handleError(err, this.$root);
        this.errorMessage = err.message;
      }
      this.loading.loadCuber = false;
    },

    reset() {
      this.generation.solves++;
    },
  },

  computed: {
    currentTab() {
      return this.tabItems[this.tab] ? this.tabItems[this.tab].tab : null;
    }
  }
}
</script>

<style scoped>
</style>