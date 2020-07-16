<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-pencil</v-icon>
        <span class="headline">Edit Competition Round</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <div v-if="loading.loadData" class="text-center" style="width: 100%;">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-container v-else>
          <v-row>
            <v-col cols="4" class="py-0">
              <v-select
                v-if="events"
                v-model="inputs.event_id"
                filled
                dense
                :items="events.data"
                label="Event"
                item-value="id"
                class="py-0"
                readonly
              >
                <template slot="selection" slot-scope="data">
                  <EventLabel :event="data.item" />
                </template>
                <template slot="item" slot-scope="data">
                  <EventLabel :event="data.item" />
                </template>
              </v-select>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="inputs.round_number"
                label="Round Number"
                filled
                dense
                class="py-0"
                type="number"
                readonly
              ></v-text-field>
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.start_at"
                label="Start At"
                type="datetime-local"
                step="1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          color="primary"
          :loading="loading.editCompetitionRound"
          @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { UPDATE_COMPETITION_ROUND } from '~/gql/mutation/competition.js'
import { COMPETITION_ROUND_QUERY } from '~/gql/query/competition.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import EventLabel from '~/components/shared/eventLabel.vue'

export default {
  components: {
    EventLabel,
  },

  props: {
    status: {
      type: Boolean,
    },

    selectedItem: {},
  },
  data() {
    return {
      inputs: {
        start_at_date: null,
        start_at_time: null,
        event_id: null,
        round_number: null,
      },

      menu: {
        start_at_date: false,
        start_at_time: false,
      },

      loading: {
        editCompetitionRound: false,
        loadData: false,
      },
    }
  },

  apollo: {
    events: {
      query: EVENTS_QUERY,
    },
  },

  computed: {},

  watch: {
    status(_val) {
      this.reset()
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async submit() {
      this.loading.editCompetitionRound = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_COMPETITION_ROUND,
          variables: {
            id: this.selectedItem.id,
            start_at: this.inputs.start_at
              ? this.inputs.start_at.replace('T', ' ')
              : null,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Competition Round Updated',
          variant: 'success',
        })

        this.$emit('submit', data.updateOrganisation)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.editCompetitionRound = false
    },

    async loadData() {
      this.loading.loadData = true
      try {
        let { data } = await this.$apollo.query({
          query: COMPETITION_ROUND_QUERY,
          variables: {
            id: this.selectedItem.id,
          },
          fetchPolicy: 'no-cache',
        })

        this.inputs = {
          start_at: data.competitionRound.start_at
            ? new Date(data.competitionRound.start_at)
                .toISOString()
                .slice(0, -1)
            : null,
          event_id: data.competitionRound.event.id,
          round_number: data.competitionRound.round_number,
        }
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    reset() {
      if (!this.status) return
      this.loadData()
    },
  },
}
</script>
