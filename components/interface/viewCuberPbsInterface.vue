<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="cuberPbs.data"
      class="elevation-1"
      :loading="false"
      :options.sync="options"
      loading-text="Loading... Please wait"
      :server-items-length="cuberPbs.paginatorInfo.total"
      dense
      :footer-props="footerOptions"
      @update:options="handleUpdateOptions"
    >
      <template v-slot:item.event="{ item }">
        <EventLabel :event="item.event" />
      </template>
      <template v-slot:item.single="{ item }">
        <span :class="{ 'winner-text': item.single.is_winner }">{{
          generateSolveString(item.single)
        }}</span>
      </template>
      <template v-slot:item.avg5="{ item }">
        <span :class="{ 'winner-text': item.avg5.is_winner }">{{
          generateAccumulatedResultString(item.avg5)
        }}</span>
      </template>
      <template v-slot:no-data>
        No results
      </template>
    </v-data-table>
  </div>
</template>

<script>
import sharedService from '~/services/shared.js'
//import { CUBER_cuberPbs_QUERY } from '~/gql/query/cuber.js'
import EventLabel from '~/components/shared/eventLabel.vue'

export default {
  components: {
    EventLabel,
  },

  props: {
    status: {
      type: Boolean,
    },

    cuber: {},
    generation: {},
  },

  data() {
    return {
      headers: [
        {
          text: 'Event',
          align: 'left',
          sortable: false,
          value: 'event',
        },
        {
          text: 'Average of 5',
          align: 'left',
          sortable: false,
          value: 'avg5',
        },
        {
          text: 'Single',
          align: 'left',
          sortable: false,
          value: 'single',
        },
      ],

      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
        initialLoad: true,
      },

      cuberPbs: {
        paginatorInfo: {
          total: 0,
          count: 0,
        },
        data: [],
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },
    }
  },
  computed: {},

  watch: {
    status(_val) {
      if (this.status) {
        this.reset()
      }
    },

    generation(_val) {
      if (this.status) {
        this.reset()
      }
    },
  },

  created() {
    this.reset()
  },

  /*
  apollo: {
    cuber: {
      query: QUERY_HERE,
      variables() {
        return {
          id: this.cuber.id,
          first: this.options.itemsPerPage,
          page: this.options.page,
        }
      },

      manual: true,

      result({ data }) {
        if (data && data.cuber) {
          this.cuberPbs = data.cuber.cuberPbs
        }
      },

      fetchPolicy: 'network-only',
    },
  },
  */
  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateAccumulatedResultString: sharedService.generateAccumulatedResultString.bind(
      sharedService,
    ),
    generateMomentString: sharedService.generateMomentString,

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        //this.reset();
      }
    },

    reset() {
      //this.$apollo.queries.cuber.refresh()
      this.cuberPbs = {
        paginatorInfo: {
          total: 3,
          count: 3,
        },
        data: [
          {
            event: {
              id: 1,
              name: '3x3x3',
            },
            avg5: {
              is_dnf: false,
              result: 12555,
              state: 'FINISHED',
              is_winner: true,
            },
            single: {
              is_dnf: false,
              result: 12555,
              state: 'FINISHED',
              is_winner: true,
            },
          },
        ],
      }
    },
  },
}
</script>
