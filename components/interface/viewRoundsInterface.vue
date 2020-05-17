<template>
  <v-data-table
    :headers="headers"
    :items="rounds.data"
    class="elevation-1"
    :loading="$apollo.queries.rounds.loading"
    :options.sync="options"
    loading-text="Loading... Please wait"
    :server-items-length="rounds.paginatorInfo.total"
    multi-sort
    must-sort
    dense
    single-expand
    show-expand
    :footer-props="footerOptions"
    @update:options="handleUpdateOptions"
  >
    <template v-slot:item.round_number="{ item }">
      #{{ item.round_number }}
    </template>

    <template v-slot:item.created_at="{ item }">
      {{ generateMomentString(item.created_at) }}
    </template>

    <template v-slot:item.winning_result="{ item }">
      <span :class="{ 'winner-text': item.is_winner }">{{
        generateSolveString(item.winning_solve)
      }}</span>
    </template>

    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        <ViewRoundInterface
          :status="status"
          :round-id="item.id"
        ></ViewRoundInterface>
      </td>
    </template>
    <template v-slot:no-data>
      No results
    </template>
  </v-data-table>
</template>

<script>
import sharedService from '~/services/shared.js'
import { ROUNDS_BASIC_QUERY } from '~/gql/query/round.js'
import ViewRoundInterface from '~/components/interface/viewRoundInterface.vue'

export default {
  components: {
    ViewRoundInterface,
  },

  props: {
    status: {
      type: Boolean,
    },

    roomId: {},
  },

  data() {
    return {
      rounds: {
        paginatorInfo: {
          total: 0,
          count: 0,
        },
        data: [],
      },

      headers: [
        { text: '', value: 'data-table-expand' },
        {
          text: 'Round',
          align: 'right',
          sortable: true,
          value: 'round_number',
        },
        {
          text: 'Best Time',
          align: 'right',
          sortable: false,
          value: 'winning_result',
        },
        {
          text: 'Champion',
          align: 'right',
          sortable: false,
          value: 'winning_solve.cuber.name',
        },
        {
          text: 'When',
          align: 'right',
          sortable: true,
          value: 'created_at',
        },
      ],

      sortNameMap: {
        created_at: 'CREATION',
        round_number: 'ROUND_NUMBER',
      },

      options: {
        page: 1,
        itemsPerPage: 25,
        sortBy: ['round_number'],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
        initialLoad: true,
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25],
      },
    }
  },
  computed: {},

  watch: {
    status(_val) {
      this.reset()
    },
  },

  created() {
    this.reset()
  },

  apollo: {
    rounds: {
      query: ROUNDS_BASIC_QUERY,
      variables() {
        return {
          first: this.options.itemsPerPage,
          page: this.options.page,
          room_id: this.roomId,
          sorting: this.options.sortBy.map(
            (ele, index) =>
              this.sortNameMap[ele] +
              '_' +
              (this.options.sortDesc[index] ? 'DESC' : 'ASC'),
          ),
        }
      },
      fetchPolicy: 'network-only',
    },
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

    reloadData() {
      this.$apollo.queries.round.refresh()
    },

    reset() {},
  },
}
</script>
