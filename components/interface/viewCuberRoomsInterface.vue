<template>
  <div>
    <v-data-table
      :headers="headers"
      :items="rooms.data"
      class="elevation-1"
      :loading="loading.loadData"
      :options.sync="options"
      loading-text="Loading... Please wait"
      :server-items-length="rooms.paginatorInfo.total"
      dense
      :footer-props="footerOptions"
      @update:options="handleUpdateOptions"
    >
      <template v-slot:item.name="{ item }">
        {{ item.name }}
        <v-icon v-if="item.has_secret" small>mdi-lock-question</v-icon>
      </template>
      <template v-slot:item.created_at="{ item }">
        {{ generateMomentString(item.created_at) }}
      </template>
      <template v-slot:item.event="{ item }">
        <EventLabel :event="item.event" />
      </template>
      <template v-slot:item.actions="{ item }">
        <v-icon small title="Enter Room" @click.stop="enterRoom(item)"
          >mdi-location-enter</v-icon
        >
        <v-icon
          v-if="hasEditPermissions"
          small
          title="Untrack Room Solves"
          color="error"
          @click.stop="openUntrackRoomSolvesDialog(item)"
          >mdi-alarm-off</v-icon
        >
        <template v-if="allowEdit && isItemCreator(item)">
          <v-icon small @click.stop="openEditRoomDialog(item)"
            >mdi-pencil</v-icon
          >
          <v-icon small @click.stop="openDeleteRoomDialog(item)"
            >mdi-delete</v-icon
          >
        </template>
      </template>
      <template v-slot:no-data>
        No results
      </template>
    </v-data-table>
    <UntrackRoomSolvesDialog
      :status="dialogs.untrackRoomSolves"
      :selected-item="selectedItem"
      @close="dialogs.untrackRoomSolves = false"
    ></UntrackRoomSolvesDialog>
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
  </div>
</template>

<script>
import sharedService from '~/services/shared.js'
import { CUBER_ROOMS_QUERY } from '~/gql/query/cuber.js'
import EventLabel from '~/components/shared/eventLabel.vue'
import UntrackRoomSolvesDialog from '~/components/dialog/room/untrackRoomSolvesDialog.vue'
import InputRoomSecretDialog from '~/components/dialog/room/inputRoomSecretDialog.vue'
import EditRoomDialog from '~/components/dialog/room/editRoomDialog.vue'
import DeleteRoomDialog from '~/components/dialog/room/deleteRoomDialog.vue'

export default {
  components: {
    EventLabel,
    UntrackRoomSolvesDialog,
    InputRoomSecretDialog,
    EditRoomDialog,
    DeleteRoomDialog,
  },

  props: {
    status: {
      type: Boolean,
    },

    cuber: {},
    generation: {},
    allowEdit: {
      type: Boolean,
    },
  },

  data() {
    return {
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
          value: 'event',
          width: '150px',
        },
        {
          text: 'When',
          align: 'left',
          sortable: true,
          value: 'created_at',
          width: '200px',
        },
        {
          text: 'Actions',
          align: 'left',
          sortable: false,
          value: 'actions',
          width: '150px',
        },
      ],

      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['created_at'],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: false,
        mustSort: false,
        initialLoad: true,
      },

      sortNameMap: {
        name: 'NAME',
        event: 'EVENT',
        created_at: 'CREATION',
      },

      dialogs: {
        untrackRoomSolves: false,
        inputSecret: false,
        editRoom: false,
        deleteRoom: false,
      },

      selectedItem: null,

      rooms: {
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
        loadData: false,
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
    this.reset(true)
  },

  methods: {
    generateSolveString: sharedService.generateSolveString.bind(sharedService),
    generateMomentString: sharedService.generateMomentString,

    deleteItem(_item) {
      this.reset()
    },

    editItem(_item) {
      this.reset()
    },

    enterRoom(room, secret = null) {
      if (room.has_secret && !secret) {
        this.selectedItem = room
        this.openDialog('inputSecret')
      } else {
        this.$router.push({
          path: '/room',
          query: {
            id: room.id,
            ...(secret && { secret }),
          },
        })
      }
    },

    isItemCreator(item) {
      if (!this.$store.getters['auth/user']) return false

      return this.$store.getters['auth/user'].id == item.creator.id
    },

    handleSecretInput(secret) {
      this.$router.push({
        path: '/room',
        query: {
          id: this.selectedItem.id,
          secret: secret,
        },
      })
    },

    openUntrackRoomSolvesDialog(item) {
      this.selectedItem = item
      this.openDialog('untrackRoomSolves')
    },

    openDeleteRoomDialog(item) {
      this.selectedItem = item
      this.openDialog('deleteRoom')
    },

    openEditRoomDialog(item) {
      this.selectedItem = item
      this.openDialog('editRoom')
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
        this.reset()
      }
    },
    async loadData() {
      this.loading.loadData = true
      try {
        let { data } = await this.$apollo.query({
          query: CUBER_ROOMS_QUERY,
          variables: {
            id: this.cuber.id,
            first: this.options.itemsPerPage,
            page: this.options.page,
            sorting: this.options.sortBy.map(
              (ele, index) =>
                this.sortNameMap[ele] +
                '_' +
                (this.options.sortDesc[index] ? 'DESC' : 'ASC'),
            ),
          },
          fetchPolicy: 'no-cache',
        })

        this.rooms = data.cuber.rooms
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    reset(initialLoad = false) {
      if (!this.status) return
      if (initialLoad) this.options.initialLoad = true

      this.loadData()
    },
  },
}
</script>
