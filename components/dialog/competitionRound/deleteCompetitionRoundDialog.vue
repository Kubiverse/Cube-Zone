<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-delete</v-icon>
        <span class="headline">Delete Competition Round</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert v-if="competitionRound" type="error">
          Confirm Delete Competition Round:
          {{ competitionRound.event.name }} (the last round will always be
          deleted first)
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          color="error"
          text
          :loading="loading.deleteCompetitionRound"
          @click="deleteCompetitionRound()"
          >Delete</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { REMOVE_COMPETITION_ROUND } from '~/gql/mutation/competition.js'

export default {
  props: {
    status: {
      type: Boolean,
    },
    competition: {
      type: Object,
      required: true,
    },
    competitionRound: {
      type: Object,
    },
  },
  data() {
    return {
      loading: {
        deleteCompetitionRound: false,
      },
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
    close() {
      this.$emit('close')
    },

    async deleteCompetitionRound() {
      this.loading.deleteCompetitionRound = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: REMOVE_COMPETITION_ROUND,
          variables: {
            competition_id: this.competition.id,
            event_id: this.competitionRound.event.id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Competition Round Deleted',
          variant: 'success',
        })

        this.$emit('submit', data)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.deleteCompetitionRound = false
    },

    reset() {},
  },
}
</script>
