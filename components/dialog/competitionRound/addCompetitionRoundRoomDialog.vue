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
        <span class="headline">Generate Competition Round Rooms</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <v-container>
          <v-row>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="inputs.quantity"
                label="Number of Rooms"
                filled
                dense
                class="py-0"
                type="number"
                min="0"
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
          :loading="loading.addCompetitionRoundRoom"
          @click="submit()"
          >Add</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { CREATE_ROOMS_FOR_COMPETITION_ROUND } from '~/gql/mutation/competition.js'

export default {
  components: {},

  props: {
    status: {
      type: Boolean,
    },
    competitionRound: {
      required: true,
    }
  },

  data() {
    return {
      inputs: {
        quantity: 1,
      },

      loading: {
        addCompetitionRoundRoom: false,
      },
    }
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
      this.loading.addCompetitionRoundRoom = true
      try {
        if (!this.inputs.quantity) {
          throw sharedService.generateError('Quantity required')
        }

        let { data } = await this.$apollo.mutate({
          mutation: CREATE_ROOMS_FOR_COMPETITION_ROUND,
          variables: {
            competition_round_id: this.competitionRound.id,
            quantity: this.inputs.quantity,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Competition Rooms Generated',
          variant: 'success',
        })

        this.$emit('submit', data.createRoomsForCompetitionRound)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addCompetitionRoundRoom = false
    },

    reset() {
      if (!this.status) return
      this.inputs = {
        quantity: 1,
      }
    },
  },
}
</script>
