<template>
  <v-container v-if="competition" fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <div class="pt-2">
          <v-data-table
            :headers="headers"
            :items="competitionRounds.data"
            class="elevation-1"
            :loading="$apollo.queries.competitionRounds.loading"
            :options.sync="options"
            loading-text="Loading... Please wait"
            :server-items-length="competitionRounds.paginatorInfo.total"
            multi-sort
            :footer-props="footerOptions"
            @update:options="handleUpdateOptions"
          >
            <template v-slot:top>
              <v-toolbar flat color="accent">
                <v-icon left>mdi-account-group</v-icon>
                <v-toolbar-title
                  >Competition: {{ competition.name }}</v-toolbar-title
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="openAddCompetitionRoundDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  New Round
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click="reset()">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-toolbar>
              <v-expansion-panels>
                <v-expansion-panel>
                  <v-expansion-panel-header class="title">
                    <span>
                      <v-icon left>mdi-filter-menu</v-icon>
                      Filters
                    </span>
                  </v-expansion-panel-header>
                  <v-expansion-panel-content>
                    <v-row>
                      <v-col cols="6">
                        <v-select
                          v-model="filterObject.event_id"
                          :items="events.data"
                          label="Filter by Events"
                          item-text="name"
                          item-value="id"
                          chips
                          filled
                        >
                          <template v-slot:selection="data">
                            <EventLabel
                              :key="data.item.id"
                              :event="data.item"
                              chip
                            />
                          </template>
                          <template v-slot:item="data">
                            <EventLabel
                              :key="data.item.id"
                              :event="data.item"
                              chip
                            />
                          </template>
                        </v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-select
                          v-model="filterObject.is_final"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Is Final"
                          item-text="name"
                          item-value="id"
                          class="py-0"
                        ></v-select>
                      </v-col>
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-slot:item="props">
              <tr
                :key="props.item.event.id + '-' + props.item.round_number"
                class="pointer-cursor"
                @click="enterCompetitionRound(props.item)"
              >
                <td class="text-xs-left">
                  {{ props.item.event.name }}
                </td>
                <td class="text-xs-left">
                  {{
                    props.item.round_number +
                    (props.item.is_final ? ' (Final)' : '')
                  }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.start_at || 'None' }}
                </td>
                <td class="text-xs-left">
                  <v-icon
                    small
                    title="Join Competition"
                    @click.stop="enterCompetitionRound(item)"
                    >mdi-location-enter</v-icon
                  >
                  <template v-if="isItemCreator(props.item)">
                    <v-icon
                      small
                      @click.stop="openEditCompetitionRoundDialog(props.item)"
                      >mdi-pencil</v-icon
                    >
                    <v-icon small @click.stop="openDeleteCompetitionRoundDialog(props.item)"
                      >mdi-delete</v-icon
                    >
                  </template>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <div>
                No rounds matched your filters
                <br />
                <v-btn
                  color="primary"
                  class="my-2"
                  dark
                  @click="openAddCompetitionRoundDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Create a Round
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-flex>
    </v-layout>
    <AddCompetitionRoundDialog
      :status="dialogs.addCompetitionRound"
      :competition="competition"
      @close="dialogs.addCompetitionRound = false"
      @submit="addItem"
    ></AddCompetitionRoundDialog>
    <EditCompetitionRoundDialog
      :status="dialogs.editCompetitionRound"
      :selected-item="selectedItem"
      @close="dialogs.editCompetitionRound = false"
      @submit="editItem"
    ></EditCompetitionRoundDialog>
    <DeleteCompetitionRoundDialog
      :status="dialogs.deleteCompetitionRound"
      :competition="competition"
      :competition-round="selectedItem"
      @close="dialogs.deleteCompetitionRound = false"
      @submit="deleteItem"
    ></DeleteCompetitionRoundDialog>
  </v-container>
  <v-container v-else fill-height justify-center>
    <div v-if="errorMessage">
      <span class="display-1 pl-2">{{ errorMessage }} </span>
    </div>
    <div v-else>
      <span class="display-1 pl-2"
        >Loading
        <v-progress-circular indeterminate></v-progress-circular>
      </span>
    </div>
  </v-container>
</template>

<script>
import sharedService from '~/services/shared.js'
import { booleanOptionsArray } from '~/services/constants.js'
import {
  COMPETITION_ROUNDS_QUERY,
  COMPETITION_BASIC_QUERY,
} from '~/gql/query/competition.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'

import AddCompetitionRoundDialog from '~/components/dialog/competitionRound/addCompetitionRoundDialog.vue'
import EditCompetitionRoundDialog from '~/components/dialog/competitionRound/editCompetitionRoundDialog.vue'
import DeleteCompetitionRoundDialog from '~/components/dialog/competitionRound/deleteCompetitionRoundDialog.vue'
import EventLabel from '~/components/shared/eventLabel.vue'

export default {
  components: {
    AddCompetitionRoundDialog,
    EditCompetitionRoundDialog,
    DeleteCompetitionRoundDialog,
    EventLabel,
  },

  data() {
    return {
      booleanOptionsArray,
      errorMessage: null,
      competition: null,

      competitionRounds: {
        paginatorInfo: {
          total: 0,
          count: 0,
        },
        data: [],
      },

      events: {
        data: [],
      },

      dialogs: {
        addCompetitionRound: false,
        editCompetitionRound: false,
        deleteCompetitionRound: false,
      },

      loading: {
        table: false,
      },

      selectedItem: null,

      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: [],
        sortDesc: [],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
        initialLoad: true,
      },

      sortNameMap: {
        round_number: 'ROUND_NUMBER',
        start_at: 'START_AT',
      },

      filterObject: {
        is_final: null,
        event_id: null,
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },

      headers: [
        {
          text: 'Event',
          align: 'left',
          sortable: false,
          value: 'event.name',
        },
        {
          text: 'Round Number',
          align: 'left',
          sortable: true,
          value: 'round_number',
        },
        {
          text: 'Start Date',
          align: 'left',
          sortable: true,
          value: 'start_at',
          width: '150px',
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'action',
          width: '90px',
        },
      ],

      generation: {
        competitionRounds: 0,
      },
    }
  },

  computed: {},

  mounted() {
    this.loadCompetition()
  },

  methods: {
    isItemCreator(_item) {
      return true
    },
    openDialog(dialogName) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
      }
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        //this.reset();
      }
    },

    openDeleteCompetitionRoundDialog(item) {
      this.selectedItem = item
      this.openDialog('deleteCompetitionRound')
    },

    openEditCompetitionRoundDialog(item) {
      this.selectedItem = item
      this.openDialog('editCompetitionRound')
    },

    openAddCompetitionRoundDialog() {
      //must be logged in
      if (!this.$store.getters['auth/user']) {
        this.$root.$emit('login-dialog', this.$route.fullPath)
        this.$notifier.showSnackbar({
          message: 'Login required',
          variant: 'error',
        })
      } else {
        this.openDialog('addCompetitionRound')
      }
    },

    addItem(_item) {
      this.reset()
    },

    deleteItem(_item) {
      this.reset()
    },

    editItem(_item) {
      //this.reset();
    },

    enterCompetitionRound(competitionRound) {
      this.$router.push({
        path: '/competition-round',
        query: {
          id: competitionRound.id,
        },
      })
    },

    async loadCompetition() {
      this.loading.loadCompetition = true
      try {
        //must be logged in
        if (!this.$store.getters['auth/user']) {
          this.$root.$emit('login-dialog', this.$route.fullPath)
          throw sharedService.generateError(
            'Login required to load competition.',
          )
        }

        let { data } = await this.$apollo.query({
          query: COMPETITION_BASIC_QUERY,
          variables: {
            id: this.$route.query.id,
          },
        })

        this.competition = data.competition

        this.$apollo.queries.events.skip = false
        this.$apollo.queries.competitionRounds.skip = false
      } catch (err) {
        sharedService.handleError(err, this.$root)
        this.errorMessage = sharedService.sanitizeErrorMessage(err.message)
      }
      this.loading.loadCompetition = false
    },

    reset() {
      this.$apollo.queries.competitionRounds.refresh()
    },
  },

  head() {
    return {
      title:
        'Competition' + (this.competition ? ' - ' + this.competition.name : ''),
    }
  },

  apollo: {
    competitionRounds: {
      query: COMPETITION_ROUNDS_QUERY,
      variables() {
        return {
          first: this.options.itemsPerPage,
          page: this.options.page,
          competition_id: this.$route.query.id,
          sorting: this.options.sortBy.map(
            (ele, index) =>
              this.sortNameMap[ele] +
              '_' +
              (this.options.sortDesc[index] ? 'DESC' : 'ASC'),
          ),
          ...(this.filterObject.is_final !== null && {
            is_final: this.filterObject.is_final,
          }),
          ...(this.filterObject.event_id !== null && {
            event_id: this.filterObject.event_id,
          }),
        }
      },
      //pollInterval: 5 * 60 * 1000,
      manual: true,
      skip: true,
      result({ data }) {
        if (data) {
          this.competitionRounds = data.competitionRounds
        }
      },
    },

    events: {
      query: EVENTS_QUERY,
      skip: true,
    },
  },
}
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}
</style>
