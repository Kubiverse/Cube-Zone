<template>
  <v-container fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <div class="pt-2">
          <v-data-table
            :headers="headers"
            :items="competitions.data"
            class="elevation-1"
            :loading="$apollo.queries.competitions.loading"
            :options.sync="options"
            loading-text="Loading... Please wait"
            :server-items-length="competitions.paginatorInfo.total"
            multi-sort
            :footer-props="footerOptions"
            @update:options="handleUpdateOptions"
          >
            <template v-slot:top>
              <v-toolbar flat color="accent">
                <v-icon left>mdi-google-classroom</v-icon>
                <v-toolbar-title>Competitions</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="openAddCompetitionDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  New Competition
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
                      <v-col cols="3">
                        <v-select
                          v-model="filterObject.is_featured"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Is Featured"
                          item-text="name"
                          item-value="id"
                          class="py-0"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-select
                          v-model="filterObject.requires_signup"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Signup Required"
                          item-text="name"
                          item-value="id"
                          class="py-0"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-select
                          v-model="filterObject.is_invitational"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Is Invitational"
                          item-text="name"
                          item-value="id"
                          class="py-0"
                        ></v-select>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="6">
                        <v-select
                          v-model="filterObject.events"
                          :items="events.data"
                          label="Filter by Events"
                          item-text="name"
                          item-value="id"
                          multiple
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
                    </v-row>
                  </v-expansion-panel-content>
                </v-expansion-panel>
              </v-expansion-panels>
            </template>
            <template v-slot:item="props">
              <tr
                :key="props.item.id"
                class="pointer-cursor"
                @click="enterCompetition(props.item)"
              >
                <td class="text-xs-left">
                  {{ props.item.name }}
                  <v-icon v-if="props.item.is_invitational" small
                    >mdi-lock-question</v-icon
                  >
                </td>
                <td class="text-xs-left">
                  {{ generateMomentString(props.item.start_date) }}
                </td>
                <td class="text-xs-left">
                  {{ generateMomentString(props.item.end_date) }}
                </td>
                <td class="text-xs-left">
                  {{ generateMomentString(props.item.created_at) }}
                </td>
                <td class="text-xs-left">
                  <v-icon
                    small
                    title="Join Competition"
                    @click.stop="enterCompetition(item)"
                    >mdi-location-enter</v-icon
                  >
                  <template v-if="isItemCreator(props.item)">
                    <v-icon
                      small
                      @click.stop="openEditCompetitionDialog(props.item)"
                      >mdi-pencil</v-icon
                    >
                    <v-icon small @click.stop="openDeleteRoomDialog(props.item)"
                      >mdi-delete</v-icon
                    >
                  </template>
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              <div>
                No competitions matched your filters
                <br />
                <v-btn
                  color="primary"
                  class="my-2"
                  dark
                  @click="openAddCompetitionDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Create a Competition
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-flex>
    </v-layout>
    <AddCompetitionDialog
      :status="dialogs.addCompetition"
      @close="dialogs.addCompetition = false"
      @submit="addItem"
    ></AddCompetitionDialog>
    <EditCompetitionDialog
      :status="dialogs.editCompetition"
      :selected-item="selectedItem"
      @close="dialogs.editCompetition = false"
      @submit="editItem"
    ></EditCompetitionDialog>
    <DeleteRoomDialog
      :status="dialogs.deleteRoom"
      :selected-item="selectedItem"
      @close="dialogs.deleteRoom = false"
      @submit="deleteItem"
    ></DeleteRoomDialog>
  </v-container>
</template>

<script>
import sharedService from '~/services/shared.js'
import { booleanOptionsArray } from '~/services/constants.js'
import { COMPETITIONS_QUERY } from '~/gql/query/competition.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import { mapGetters } from 'vuex'

import AddCompetitionDialog from '~/components/dialog/competition/addCompetitionDialog.vue'
import EditCompetitionDialog from '~/components/dialog/competition/editCompetitionDialog.vue'
import DeleteRoomDialog from '~/components/dialog/room/deleteRoomDialog.vue'
import EventLabel from '~/components/shared/eventLabel.vue'

export default {
  components: {
    AddCompetitionDialog,
    EditCompetitionDialog,
    DeleteRoomDialog,
    EventLabel,
  },

  data() {
    return {
      booleanOptionsArray,

      competitions: {
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
        addCompetition: false,
        editCompetition: false,
        deleteRoom: false,
      },

      loading: {
        table: false,
      },

      selectedItem: null,

      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['created_at'],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
        initialLoad: true,
      },

      sortNameMap: {
        name: 'NAME',
        start_date: 'START_DATE',
      },

      filterObject: {
        is_featured: null,
        requires_signup: null,
        is_invitational: null,
        events: [],
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },

      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: true,
          value: 'name',
        },
        {
          text: 'Start Date',
          align: 'left',
          sortable: true,
          value: 'start_date',
          width: '150px',
        },
        {
          text: 'End Date',
          align: 'left',
          sortable: false,
          value: 'end_date',
          width: '150px',
        },
        {
          text: 'Created',
          align: 'left',
          sortable: false,
          value: 'created_at',
          width: '200px',
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'action',
          width: '90px',
        },
      ],

      generation: {
        competitions: 0,
      },
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
  },

  mounted() {
    this.$apollo.queries.competitions.skip = false
    this.$apollo.queries.events.skip = false
    //this.reset();
  },

  methods: {
    generateMomentString: sharedService.generateMomentString,

    isItemCreator(item) {
      if (!this.$store.getters['auth/user']) return false

      return this.$store.getters['auth/user'].id == item.creator.id
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

    openDeleteRoomDialog(item) {
      this.selectedItem = item
      this.openDialog('deleteRoom')
    },

    openEditCompetitionDialog(item) {
      this.selectedItem = item
      this.openDialog('editCompetition')
    },

    openAddCompetitionDialog() {
      //must be logged in
      if (!this.$store.getters['auth/user']) {
        this.$root.$emit('login-dialog', this.$route.fullPath)
        this.$notifier.showSnackbar({
          message: 'Login required',
          variant: 'error',
        })
      } else {
        this.openDialog('addCompetition')
      }
    },

    addItem(item) {
      this.enterCompetition(item)
    },

    deleteItem(_item) {
      this.reset()
    },

    editItem(_item) {
      //this.reset();
    },

    enterCompetition(competition) {
      this.$router.push({
        path: '/competition',
        query: {
          id: competition.id,
        },
      })
    },

    reset() {
      this.$apollo.queries.competitions.refresh()
    },
  },

  head() {
    return {
      title: 'Competitions',
    }
  },

  apollo: {
    competitions: {
      query: COMPETITIONS_QUERY,
      variables() {
        return {
          first: this.options.itemsPerPage,
          page: this.options.page,
          sorting: this.options.sortBy.map(
            (ele, index) =>
              this.sortNameMap[ele] +
              '_' +
              (this.options.sortDesc[index] ? 'DESC' : 'ASC'),
          ),
          ...(this.filterObject.is_featured !== null && {
            is_featured: this.filterObject.is_featured,
          }),
          ...(this.filterObject.is_invitational !== null && {
            is_invitational: this.filterObject.is_invitational,
          }),
          ...(this.filterObject.requires_signup !== null && {
            requires_signup: this.filterObject.requires_signup,
          }),
        }
      },
      //pollInterval: 5 * 60 * 1000,
      manual: true,
      skip: true,
      result({ data }) {
        if (data) {
          this.competitions = data.competitions
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
