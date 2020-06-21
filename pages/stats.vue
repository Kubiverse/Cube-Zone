<template>
  <v-container fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <v-card class="mt-2">
          <v-toolbar flat color="accent">
            <v-icon left>mdi-format-list-numbered</v-icon>
            <v-toolbar-title>
              Global Stats
            </v-toolbar-title>
            <v-spacer></v-spacer>
            <Button icon @click="reset()">
              <v-icon>mdi-refresh</v-icon>
            </Button>
          </v-toolbar>
          <v-tabs v-model="tab">
            <v-tab v-for="item in tabItems" :key="item.tab">
              {{ item.title }}
            </v-tab>
          </v-tabs>

          <v-tabs-items v-model="tab">
            <v-tab-item key="solves">
              <v-row>
                <v-col cols="3">
                  <v-select
                    v-model="filterObject.event_id"
                    filled
                    dense
                    :items="events.data"
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
                    v-model="filterObject.is_tracked"
                    filled
                    dense
                    :items="booleanOptionsArray"
                    label="Is Tracked"
                    item-text="name"
                    item-value="id"
                    class="py-0"
                  ></v-select>
                </v-col>
              </v-row>
              <ViewCuberSolvesInterface
                :status="currentTab == 'solves'"
                :generation="generation.solves"
                :filter-object="filterObject"
              ></ViewCuberSolvesInterface>
            </v-tab-item>
          </v-tabs-items>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { booleanOptionsArray } from '~/services/constants.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import ViewCuberSolvesInterface from '~/components/interface/viewCuberSolvesInterface.vue'
import EventLabel from '~/components/shared/eventLabel.vue'
import Button from '~/components/shared/button.vue'

export default {
  components: {
    ViewCuberSolvesInterface,
    EventLabel,
    Button,
  },

  data() {
    return {
      booleanOptionsArray,
      cuber: null,
      events: {
        data: [{ id: null, name: 'Any' }],
      },
      generation: {
        solves: 0,
        events: 0,
      },

      loading: {
        toggleFollow: false,
      },

      filterObject: {
        event_id: null,
        is_tracked: true,
      },

      tab: null,
      tabItems: [{ tab: 'solves', title: 'Recent Solves' }],
    }
  },
  computed: {
    currentTab() {
      return this.tabItems[this.tab] ? this.tabItems[this.tab].tab : null
    },
  },

  mounted() {
    this.$apollo.queries.events.skip = false
  },

  apollo: {
    events: {
      query: EVENTS_QUERY,

      manual: true,
      result({ data }) {
        if (++this.generation.events % 2 == 0) {
          this.events.data.push(...data.events.data)
        }
      },

      skip: true,
    },
  },

  methods: {
    openDialog(dialogName) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
      }
    },

    reset() {
      this.generation.solves++
    },
  },

  head() {
    return {
      title: 'Stats',
    }
  },
}
</script>

<style scoped></style>
