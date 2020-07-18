<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-pencil</v-icon>
        <span class="headline">Edit Room</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <div v-if="hidden">
          <v-alert type="error">
            {{ errorMessage }}
          </v-alert>
        </div>
        <div
          v-else-if="loading.loadData"
          class="text-center"
          style="width: 100%;"
        >
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-container v-else>
          <v-row v-if="!hidden">
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field
                v-model="inputs.name"
                label="Name"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" class="py-0">
              <v-textarea
                v-model="inputs.description"
                label="Description"
                filled
                dense
                class="py-0"
              ></v-textarea>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="inputs.time_limit"
                label="Time Limit (sec) (optional)"
                filled
                dense
                class="py-0"
                type="number"
                step="0.001"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="inputs.time_target"
                label="Time Target (sec) (optional)"
                filled
                dense
                class="py-0"
                type="number"
                step="0.001"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field
                v-model="inputs.max_capacity"
                label="Max Capacity (optional)"
                filled
                dense
                class="py-0"
                type="number"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
        <v-container>
          <v-row>
            <v-col v-if="hidden" cols="6" class="py-0">
              <v-btn
                color="primary"
                :loading="loading.unhideRoom"
                @click="unhideRoomAndReset(selectedItem)"
                >Unhide Room Now</v-btn
              >
            </v-col>
            <v-col cols="6" class="py-0">
              <v-text-field
                v-model="inputs.activate_at"
                label="Activate At"
                type="datetime-local"
                step="1"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="primary" :loading="loading.editRoom" @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { UPDATE_ROOM_MUTATION } from '~/gql/mutation/room.js'
import { UNHIDE_ROOM } from '~/gql/mutation/competition.js'
import { ROOM_BASIC_QUERY } from '~/gql/query/room.js'

export default {
  props: {
    status: {
      type: Boolean,
    },

    selectedItem: {},
  },
  data() {
    return {
      inputs: {
        name: '',
        description: '',
        activate_at: null,
        time_limit: 10,
        time_target: 20,
        max_capacity: 8,
      },

      hidden: false,

      loading: {
        editRoom: false,
        loadData: false,
        unhideRoom: false,
      },
      errorMessage: null,
      events: null,
    }
  },

  computed: {
    id() {
      return this.selectedItem ? this.selectedItem.id : null
    },
  },

  watch: {
    status(_val) {
      this.reset()
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async submit() {
      this.loading.editRoom = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_ROOM_MUTATION,
          variables: {
            id: this.selectedItem.id,
            ...(!this.hidden && {
              name: this.inputs.name,
              description: this.inputs.description,
              time_limit: parseInt(this.inputs.time_limit * 1000) || undefined,
              time_target:
                parseInt(this.inputs.time_target * 1000) || undefined,
              max_capacity: parseInt(this.inputs.max_capacity) || undefined,
            }),
            activate_at: this.inputs.activate_at
              ? this.inputs.activate_at.replace('T', ' ')
              : null,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Room Updated',
          variant: 'success',
        })

        this.$emit('submit', data)

        this.close()
      } catch (err) {
        //if the room is hidden, it will throw an error, which we much handle specially
        if (this.hidden) {
          this.$notifier.showSnackbar({
            message: 'Room Updated',
            variant: 'success',
          })

          this.close()
        } else {
          sharedService.handleError(err, this.$root)
        }
      }
      this.loading.editRoom = false
    },

    async unhideRoomAndReset(item) {
      await this.unhideRoom(item)
      this.reset()
    },

    async unhideRoom(item) {
      this.loading.unhideRoom = true
      try {
        await this.$apollo.mutate({
          mutation: UNHIDE_ROOM,
          variables: {
            id: item.id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Room Unhidden',
          variant: 'success',
        })
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.unhideRoom = false
    },

    async loadData() {
      this.loading.loadData = true
      try {
        let { data } = await this.$apollo.query({
          query: ROOM_BASIC_QUERY,
          variables: {
            id: this.selectedItem.id,
          },
          fetchPolicy: 'no-cache',
        })

        //if room is null, room could be hidden or deleted
        if (!data.room) {
          this.hidden = true
          throw sharedService.generateError('Room is either hidden or deleted')
        }

        this.inputs = {
          name: data.room.name,
          description: data.room.description,
          activate_at: data.room.activate_at
            ? new Date(data.room.activate_at).toISOString().slice(0, -1)
            : null,
          time_limit: data.room.time_limit / 1000,
          time_target: data.room.time_target / 1000,
          max_capacity: data.room.max_capacity,
        }
      } catch (err) {
        this.errorMessage = err.message
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    reset() {
      if (!this.status) return
      this.hidden = false
      this.errorMessage = null
      this.loadData()
    },
  },
}
</script>
