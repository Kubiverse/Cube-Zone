<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="solves.data"
      class="elevation-1"
      :loading="$apollo.queries.solves.loading"
      :options.sync="options"
      loading-text="Loading... Please wait"
      :server-items-length="solves.paginatorInfo.total"
      single-expand
      show-expand
      dense
      :footer-props="footerOptions"
      @update:options="handleUpdateOptions"
    >
      <template v-slot:item.result="{ item }">
        <span :class="{ 'winner-text': item.is_winner }">{{
          generateSolveString(item)
        }}</span>
        <v-icon
          v-if="hasEditPermissions"
          small
          title="Toggle Track"
          :color="item.is_tracked ? null : 'error'"
          @click.stop="toggleSolveTracked(item)"
          >{{ item.is_tracked ? 'mdi-alarm' : 'mdi-alarm-off' }}</v-icon
        >
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ generateMomentString(item.created_at) }}
      </template>
      <template v-slot:item.event="{ item }">
        <EventLabel :event="item.event" />
      </template>
      <template v-slot:item.whereabout="{ item }">
        <span v-if="item.room"
          >{{ item.room.name }} (#{{ item.round.round_number }})</span
        >
        <i v-else>(Deleted)</i>
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <ViewRoundInterface
            :status="true"
            :round-id="item.round.id"
            :has-edit-permissions="hasEditPermissions"
            @room-untracked="handleRoomUntracked"
          ></ViewRoundInterface>
        </td>
      </template>

      <template v-slot:no-data>
        No results
      </template>
    </v-data-table>
  </div>
</template>

<script>
import sharedService from '~/services/shared.js'
import { SOLVES_QUERY } from '~/gql/query/solve.js'
import { UPDATE_SOLVE_MUTATION } from '~/gql/mutation/room.js'
import ViewRoundInterface from '~/components/interface/viewRoundInterface.vue'
import EventLabel from '~/components/shared/eventLabel.vue'

export default {
  components: {
    ViewRoundInterface,
    EventLabel,
  },

  props: {
    status: {
      type: Boolean,
    },

    cuber: {},
    generation: {},
    filterObject: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },

  data() {
    return {
      headers: [
        { text: '', value: 'data-table-expand' },
        {
          text: 'Result',
          align: 'right',
          sortable: true,
          value: 'result',
          width: '50px',
        },
        {
          text: 'Event',
          align: 'right',
          sortable: false,
          value: 'event',
          width: '150px',
        },
        {
          text: 'Where',
          align: 'right',
          sortable: false,
          value: 'whereabout',
          width: '200px',
        },
        {
          text: 'When',
          align: 'right',
          sortable: true,
          value: 'created_at',
          width: '120px',
        },
      ],

      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: ['created_at'],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: true,
        initialLoad: true,
      },

      sortNameMap: {
        result: 'RESULT',
        created_at: 'CREATION',
      },

      solves: {
        paginatorInfo: {
          total: 0,
          count: 0,
        },
        data: [],
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },

      loading: {
        updateSolve: false,
      },
    }
  },
  computed: {
    hasEditPermissions() {
      return (
        this.cuber && this.$store.getters['auth/user']?.id === this.cuber?.id
      )
    },
  },

  watch: {
    status(_val) {
      this.reset()
    },

    generation(_val) {
      this.reset()
    },
  },

  created() {
    this.reset()
  },

  apollo: {
    solves: {
      query: SOLVES_QUERY,
      variables() {
        return {
          first: this.options.itemsPerPage,
          page: this.options.page,
          ...(this.cuber && { cuber_id: this.cuber.id }),
          state: 'FINISHED',
          sorting: this.options.sortBy.map(
            (ele, index) =>
              this.sortNameMap[ele] +
              '_' +
              (this.options.sortDesc[index] ? 'DESC' : 'ASC'),
          ),
          ...(this.filterObject.event_id !== null && {
            event_id: this.filterObject.event_id,
          }),
          ...(this.filterObject.is_tracked !== null && {
            is_tracked: this.filterObject.is_tracked,
          }),
        }
      },

      fetchPolicy: 'network-only',
    },
  },

  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateMomentString: sharedService.generateMomentString,

    handleRoomUntracked() {
      this.reset()
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        //this.reset();
      }
    },

    async toggleSolveTracked(solve) {
      this.loading.updateSolve = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_SOLVE_MUTATION,
          variables: {
            solve_id: solve.id,
            is_tracked: !solve.is_tracked,
          },
        })

        solve.is_tracked = data.updateSolve.is_tracked

        const message = solve.is_tracked ? 'Solve tracked' : 'Solve un-tracked'

        this.$notifier.showSnackbar({
          message,
          variant: 'success',
        })
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.updateSolve = false
    },

    reloadData() {
      this.$apollo.queries.solves.refresh()
    },

    reset() {
      if (!this.status) return
      this.$apollo.queries.solves.refresh()
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
