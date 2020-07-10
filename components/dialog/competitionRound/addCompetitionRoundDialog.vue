<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-plus</v-icon>
        <span class="headline">New Competition Round</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <v-container>
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
              >
                <template slot="selection" slot-scope="data">
                  <EventLabel :event="data.item" />
                </template>
                <template slot="item" slot-scope="data">
                  <EventLabel :event="data.item" />
                </template>
              </v-select>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Cancel</Button>
        <Button
          color="primary"
          :loading="loading.addCompetitionRound"
          @click="submit()"
          >Add</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { ADD_COMPETITION_ROUND } from '~/gql/mutation/competition.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import EventLabel from '~/components/shared/eventLabel.vue'
import Button from '~/components/shared/button.vue'

export default {
  components: {
    EventLabel,
    Button,
  },

  props: {
    status: {
      type: Boolean,
    },
    competition: {
      required: true,
    },
  },

  data() {
    return {
      inputs: {
        event_id: '1',
      },

      loading: {
        addCompetitionRound: false,
      },
    }
  },

  apollo: {
    events: {
      query: EVENTS_QUERY,
    },
  },

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
      this.loading.addCompetitionRound = true
      try {
        if (!this.inputs.event_id) {
          throw sharedService.generateError('Event required')
        }

        let { data } = await this.$apollo.mutate({
          mutation: ADD_COMPETITION_ROUND,
          variables: {
            competition_id: this.competition.id,
            event_id: this.inputs.event_id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Competition Round Added',
          variant: 'success',
        })

        this.$emit('submit', data.addCompetitionRound)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addCompetitionRound = false
    },

    reset() {
      if (!this.status) return
      this.inputs = {
        event_id: '1',
      }
    },
  },
}
</script>
