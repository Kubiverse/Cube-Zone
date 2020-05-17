<template>
  <div v-if="loading.loadRound">
    <v-progress-linear indeterminate></v-progress-linear>
  </div>
  <div v-else-if="round">
    <div>Scramble: <Scramble :scramble="round.scramble" /></div>
    <div>
      Room Name:
      <span v-if="round.room">
        {{ round.room.name }}
        <v-icon
          v-if="hasEditPermissions"
          small
          title="Untrack Room Solves"
          right
          color="error"
          @click.stop="openUntrackRoomSolvesDialog(round.room)"
          >mdi-alarm-off</v-icon
        >
      </span>
      <i v-else>(Deleted)</i>
    </div>
    <div>Round Number: {{ round.round_number }}</div>
    <div>When: {{ generateMomentString(round.created_at) }}</div>
    <v-simple-table dense>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">Cuber</th>
            <th class="text-left" width="150">Result</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in round.solves" :key="item.id">
            <td>
              {{ item.cuber.name }}
            </td>
            <td :class="{ 'winner-text': item.is_winner }">
              {{ generateSolveString(item) }}
            </td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
    <UntrackRoomSolvesDialog
      :status="dialogs.untrackRoomSolves"
      :selected-item="selectedItem"
      @close="dialogs.untrackRoomSolves = false"
      @room-untracked="handleRoomUntracked"
    ></UntrackRoomSolvesDialog>
  </div>
</template>

<script>
import sharedService from '~/services/shared.js'
import { ROUND_QUERY } from '~/gql/query/round.js'
import Scramble from '~/components/shared/scramble'
import UntrackRoomSolvesDialog from '~/components/dialog/room/untrackRoomSolvesDialog.vue'

export default {
  components: {
    Scramble,
    UntrackRoomSolvesDialog,
  },

  props: {
    status: {
      type: Boolean,
    },

    roundId: {},
    hasEditPermissions: {
      type: Boolean,
    },
  },

  data() {
    return {
      round: null,
      loading: {
        loadRound: false,
      },
      dialogs: {
        untrackRoomSolves: false,
      },
      selectedItem: null,
    }
  },

  computed: {},

  watch: {
    status(_val) {
      if (this.status) {
        this.reset()
      }
    },

    roundId(_val) {
      if (this.status) {
        this.reset()
      }
    },
  },

  created() {
    this.reset()
  },

  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateMomentString: sharedService.generateMomentString,
    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        //this.reset();
      }
    },

    handleRoomUntracked() {
      this.$emit('room-untracked')
    },

    openUntrackRoomSolvesDialog(item) {
      this.selectedItem = item
      this.openDialog('untrackRoomSolves')
    },

    openDialog(dialogName) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
      }
    },

    reloadData() {
      this.$apollo.queries.round.refresh()
    },

    async loadData() {
      this.loading.loadRound = true
      try {
        let { data } = await this.$apollo.query({
          query: ROUND_QUERY,
          variables: {
            id: this.roundId,
          },
          fetchPolicy: 'no-cache',
        })

        this.round = data.round
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadRound = false
    },

    reset() {
      this.loadData()
    },
  },
}
</script>

<style scoped>
.winner-text {
  color: green;
  font-weight: bold;
}
</style>
