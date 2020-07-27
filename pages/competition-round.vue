<template>
  <v-container v-if="competitionRound" fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <div class="pt-2">
          <v-data-table
            :headers="headers"
            :items="rooms.data"
            class="elevation-1"
            :loading="$apollo.queries.rooms.loading"
            :options.sync="options"
            loading-text="Loading... Please wait"
            :server-items-length="rooms.paginatorInfo.total"
            multi-sort
            :footer-props="footerOptions"
            @update:options="handleUpdateOptions"
          >
            <template v-slot:top>
              <v-toolbar flat color="accent">
                <v-btn icon @click="goToCompetitionPage">
                  <v-icon>mdi-arrow-left</v-icon>
                </v-btn>
                <v-icon left>mdi-google-classroom</v-icon>
                <v-toolbar-title
                  >{{ competitionRound.competition.name }}:
                  {{ competitionRound.event.name }} Round
                  {{ competitionRound.round_number }}</v-toolbar-title
                >
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="openAddCompetitionRoundRoomDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Generate Rooms
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click="reset()">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-toolbar>
              <!--
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
                          v-model="filterObject.is_active"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Is Active"
                          item-text="name"
                          item-value="id"
                          class="py-0"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-select
                          v-model="filterObject.is_full"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Is Full"
                          item-text="name"
                          item-value="id"
                          class="py-0"
                        ></v-select>
                      </v-col>
                      <v-col cols="3">
                        <v-select
                          v-model="filterObject.has_secret"
                          filled
                          dense
                          :items="booleanOptionsArray"
                          label="Has Secret"
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
              -->
            </template>
            <template v-slot:item="props">
              <tr
                :key="props.item.id"
                class="pointer-cursor"
                @click="enterRoom(props.item)"
              >
                <td class="text-xs-left">
                  {{ props.item.name }}
                  <v-icon v-if="props.item.has_secret" small
                    >mdi-lock-question</v-icon
                  >
                  <span class="pl-2">
                    <CuberAvatar
                      v-for="item in props.item.active_cubers.data"
                      :key="item.id"
                      :cuber="item"
                    ></CuberAvatar>
                  </span>

                  <span
                    v-if="
                      props.item.active_cubers.paginatorInfo.total -
                        props.item.active_cubers.paginatorInfo.count >
                      0
                    "
                    >+{{
                      props.item.active_cubers.paginatorInfo.total -
                      props.item.active_cubers.paginatorInfo.count
                    }}</span
                  >
                </td>
                <td class="text-xs-left">
                  <EventLabel :event="props.item.event" />
                </td>
                <td class="text-xs-left">
                  {{ props.item.time_limit / 1000 || 'None' }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.time_target / 1000 || 'None' }}
                </td>
                <td class="text-xs-left">{{ props.item.creator.name }}</td>
                <td class="text-xs-left">
                  {{ props.item.active_cubers.paginatorInfo.total }} /
                  {{ props.item.max_capacity || 'None' }}
                </td>
                <td class="text-xs-left">
                  {{ generateMomentString(props.item.created_at) }}
                </td>
                <td class="text-xs-left">
                  <v-icon small title="Join Room" @click.stop="enterRoom(item)"
                    >mdi-location-enter</v-icon
                  >
                  <v-icon
                    small
                    title="Spectate room"
                    @click.stop="enterRoom(props.item, 'SPECTATING')"
                    >mdi-eye</v-icon
                  >
                  <template v-if="isItemCreator(props.item)">
                    <v-icon small @click.stop="openEditRoomDialog(props.item)"
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
                No rooms
                <br />
                <v-btn
                  color="primary"
                  class="my-2"
                  dark
                  @click="openAddCompetitionRoundRoomDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  Generate Rooms
                </v-btn>
              </div>
            </template>
          </v-data-table>
        </div>
      </v-flex>
    </v-layout>
    <AddCompetitionRoundRoomDialog
      :status="dialogs.addCompetitionRoundRoom"
      :competition-round="competitionRound"
      @close="dialogs.addCompetitionRoundRoom = false"
      @submit="addItem"
    ></AddCompetitionRoundRoomDialog>
    <EditRoomDialog
      :status="dialogs.editRoom"
      :selected-item="selectedItem"
      @close="dialogs.editRoom = false"
      @submit="editItem"
    ></EditRoomDialog>
    <DeleteRoomDialog
      :status="dialogs.deleteRoom"
      :selected-item="selectedItem"
      @close="dialogs.deleteRoom = false"
      @submit="deleteItem"
    ></DeleteRoomDialog>
    <InputRoomSecretDialog
      :status="dialogs.inputSecret"
      @close="dialogs.inputSecret = false"
      @submit="handleSecretInput"
    ></InputRoomSecretDialog>
  </v-container>
  <v-container v-else fill-height justify-center>
    <div>
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
import { COMPETITION_ROUND_ROOMS_QUERY } from '~/gql/query/competition.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import { mapGetters } from 'vuex'

import AddCompetitionRoundRoomDialog from '~/components/dialog/competitionRound/addCompetitionRoundRoomDialog.vue'
import EditRoomDialog from '~/components/dialog/room/editRoomDialog.vue'
import DeleteRoomDialog from '~/components/dialog/room/deleteRoomDialog.vue'
import InputRoomSecretDialog from '~/components/dialog/room/inputRoomSecretDialog.vue'
import EventLabel from '~/components/shared/eventLabel.vue'
import CuberAvatar from '~/components/shared/cuberAvatar.vue'

export default {
  components: {
    AddCompetitionRoundRoomDialog,
    EditRoomDialog,
    DeleteRoomDialog,
    InputRoomSecretDialog,
    EventLabel,
    CuberAvatar,
  },

  data() {
    return {
      booleanOptionsArray,

      competitionRound: null,

      events: {
        data: [],
      },

      dialogs: {
        addCompetitionRoundRoom: false,
        editRoom: false,
        deleteRoom: false,
        inputSecret: false,
      },

      loading: {
        table: false,
        unhideRoom: false,
      },

      selectedItem: null,
      enterRoomStatus: null,

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
        'event.name': 'EVENT',
        created_at: 'CREATION',
      },

      filterObject: {
        is_active: true,
        has_secret: null,
        is_full: null,
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
          text: 'Event',
          align: 'left',
          sortable: true,
          value: 'event.name',
          width: '150px',
        },
        {
          text: 'Time Limit',
          align: 'left',
          sortable: false,
          value: 'time_limit',
          width: '100px',
        },
        {
          text: 'Time Target',
          align: 'left',
          sortable: false,
          value: 'time_target',
          width: '100px',
        },
        { text: 'Creator', value: 'creator.name', width: '200px' },
        {
          text: 'Capacity',
          align: 'left',
          sortable: false,
          value: 'max_capacity',
          width: '120px',
        },
        {
          text: 'Created',
          align: 'left',
          sortable: true,
          value: 'created_at',
          width: '200px',
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'action',
          width: '130px',
        },
      ],

      generation: {
        rooms: 0,
      },
    }
  },

  computed: {
    rooms() {
      return {
        paginatorInfo: {
          total: this.competitionRound.rooms.length,
          count: this.competitionRound.rooms.length,
        },
        data: this.competitionRound.rooms,
      }
    },
    ...mapGetters({
      user: 'auth/user',
    }),
  },

  mounted() {
    this.$apollo.queries.rooms.skip = false
    this.$apollo.queries.events.skip = false
    //this.reset();
  },

  methods: {
    generateMomentString: sharedService.generateMomentString,

    goToCompetitionPage() {
      if (!this.competitionRound) return

      this.$router.push({
        path: '/competition',
        query: {
          id: this.competitionRound.competition.id,
        },
      })
    },

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

    openEditRoomDialog(item) {
      this.selectedItem = item
      this.openDialog('editRoom')
    },

    openAddCompetitionRoundRoomDialog() {
      //must be logged in
      if (!this.$store.getters['auth/user']) {
        this.$root.$emit('login-dialog', this.$route.fullPath)
        this.$notifier.showSnackbar({
          message: 'Login required',
          variant: 'error',
        })
      } else {
        this.openDialog('addCompetitionRoundRoom')
      }
    },

    addItem() {
      this.reset()
      //this.enterRoom(item, null, secret)
    },

    deleteItem(_item) {
      this.reset()
    },

    editItem(_item) {
      //this.reset();
    },

    enterRoom(room, status = null, secret = null) {
      if (room.has_secret && !secret) {
        this.selectedItem = room
        this.enterRoomStatus = status
        this.openDialog('inputSecret')
      } else {
        this.$router.push({
          path: '/room',
          query: {
            id: room.id,
            ...(secret && { secret }),
            ...(status && { status }),
          },
        })
      }
    },

    handleSecretInput(secret) {
      this.$router.push({
        path: '/room',
        query: {
          id: this.selectedItem.id,
          secret: secret,
          ...(this.enterRoomStatus && { status: this.enterRoomStatus }),
        },
      })
    },

    reset() {
      this.$apollo.queries.rooms.refresh()
    },
  },

  head() {
    return {
      title: 'Rooms',
    }
  },

  apollo: {
    rooms: {
      query: COMPETITION_ROUND_ROOMS_QUERY,
      variables() {
        return {
          id: this.$route.query.id,
          /*
          first: this.options.itemsPerPage,
          page: this.options.page,
          sorting: this.options.sortBy.map(
            (ele, index) =>
              this.sortNameMap[ele] +
              '_' +
              (this.options.sortDesc[index] ? 'DESC' : 'ASC'),
          ),
          ...(this.filterObject.is_active !== null && {
            is_active: this.filterObject.is_active,
          }),
          ...(this.filterObject.has_secret !== null && {
            has_secret: this.filterObject.has_secret,
          }),
          ...(this.filterObject.is_full !== null && {
            is_full: this.filterObject.is_full,
          }),
          ...(this.filterObject.events.length > 0 && {
            events: this.filterObject.events.map((ele) => parseInt(ele)),
          }),
          */
        }
      },
      //pollInterval: 5 * 60 * 1000,
      manual: true,
      skip: true,
      result({ data }) {
        if (data) {
          this.competitionRound = data.competitionRound
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
