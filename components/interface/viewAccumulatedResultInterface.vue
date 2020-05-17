<template>
  <div v-if="loading.loadData">
    <v-progress-linear indeterminate></v-progress-linear>
  </div>
  <div v-else-if="accumulatedResult">
    <div>Result: {{ generateAccumulatedResultString(accumulatedResult) }}</div>
    <div>
      Where:
      <span v-if="accumulatedResult.room">
        {{ accumulatedResult.room.name }}
      </span>
      <i v-else>(Deleted)</i>
    </div>
    <div>
      Solves: {{ solvesString }}
      <v-icon right small @click="copyToClipboard(solvesString)"
        >mdi-content-copy</v-icon
      >
    </div>
    <v-data-table
      :headers="headers"
      :items="solves.data"
      class="elevation-1"
      :loading="loading.loadData"
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
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ generateMomentString(item.created_at) }}
      </template>
      <template v-slot:item.eventLabel="{ item }">
        <EventLabel :event="item.event" />
      </template>
      <template v-slot:item.round_number="{ item }">
        #{{ item.round.round_number }}
      </template>
      <template v-slot:expanded-item="{ headers, item }">
        <td :colspan="headers.length">
          <ViewRoundInterface
            :status="true"
            :round-id="item.round.id"
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
import { ACCUMULATED_RESULT_QUERY } from '~/gql/query/accumulatedResult.js'
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

    selectedId: {},
  },

  data() {
    return {
      accumulatedResult: null,

      solves: {
        paginatorInfo: {
          total: 0,
          count: 0,
        },
        data: [],
      },

      headers: [
        { text: '', value: 'data-table-expand' },
        {
          text: 'Result',
          align: 'right',
          sortable: false,
          value: 'result',
          width: '50px',
        },
        {
          text: 'Event',
          align: 'right',
          sortable: false,
          value: 'eventLabel',
          width: '150px',
        },
        {
          text: 'Round',
          align: 'right',
          sortable: false,
          value: 'round_number',
          width: '200px',
        },
        {
          text: 'When',
          align: 'right',
          sortable: false,
          value: 'created_at',
          width: '120px',
        },
      ],

      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
        initialLoad: true,
      },

      loading: {
        loadData: false,
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },
    }
  },

  computed: {
    solvesString() {
      return this.solves.data
        .map((solve) => sharedService.generateSolveString(solve))
        .join(', ')
    },
  },

  watch: {
    status(_val) {
      this.reset()
    },
  },

  created() {
    this.reset()
  },

  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateMomentString: sharedService.generateMomentString,
    generateAccumulatedResultString: sharedService.generateAccumulatedResultString.bind(
      sharedService,
    ),

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        this.reset()
      }
    },

    copyToClipboard(content) {
      sharedService.copyToClipboard(this, content)
    },

    async loadData() {
      this.loading.loadData = true
      try {
        let { data } = await this.$apollo.query({
          query: ACCUMULATED_RESULT_QUERY,
          variables: {
            id: this.selectedId,
            first: this.options.itemsPerPage,
            page: this.options.page,
          },
          fetchPolicy: 'no-cache',
        })

        this.accumulatedResult = data.accumulatedResult

        this.solves = data.accumulatedResult.solves
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    reset() {
      if (!this.status) return
      this.options.initialLoad = true
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
