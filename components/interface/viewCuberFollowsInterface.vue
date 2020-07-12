<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="follows.data"
      class="elevation-1"
      :loading="$apollo.queries.cuber.loading"
      :options.sync="options"
      loading-text="Loading... Please wait"
      :server-items-length="follows.paginatorInfo.total"
      dense
      :footer-props="footerOptions"
      @update:options="handleUpdateOptions"
    >
      <template v-slot:item="props">
        <tr
          :key="props.item.id"
          class="pointer-cursor"
          :class="{ 'selected-bg': props.item === selected }"
          @click="handleItemSelect(props.item)"
        >
          <td>
            <PreviewCuberPopover
              :selected-item="props.item"
            ></PreviewCuberPopover>
          </td>
        </tr>
      </template>
      <template v-slot:no-data>
        No results
      </template>
    </v-data-table>
  </div>
</template>

<script>
import sharedService from '~/services/shared.js'
import { CUBER_FOLLOWS_QUERY } from '~/gql/query/cuber.js'
import PreviewCuberPopover from '~/components/popover/previewCuberPopover'

export default {
  components: {
    PreviewCuberPopover,
  },

  props: {
    status: {
      type: Boolean,
    },

    cuber: {},
    generation: {},
    selectable: {
      type: Boolean,
    },
  },

  data() {
    return {
      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
      ],

      selected: null,

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

      follows: {
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

  apollo: {
    cuber: {
      query: CUBER_FOLLOWS_QUERY,
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
          this.follows = data.cuber.follows
        }
      },

      fetchPolicy: 'network-only',
    },
  },

  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateMomentString: sharedService.generateMomentString,

    handleItemSelect(cuber) {
      this.selected = cuber === this.selected ? null : cuber
      this.$emit('item-selected', this.selected)
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        //this.reset();
      }
    },

    reloadData() {
      this.$apollo.queries.cuber.refresh()
    },

    reset() {
      this.selected = null
      this.$apollo.queries.cuber.refresh()
    },
  },
}
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}

.selected-bg {
  background-color: yellow;
}
</style>
