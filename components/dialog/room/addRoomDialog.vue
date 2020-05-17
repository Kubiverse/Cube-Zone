<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-plus</v-icon>
        <span class="headline">New Room</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <v-container>
          <v-row>
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
                min="0"
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
                min="0"
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
                min="0"
              ></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-select
                v-if="events"
                v-model="inputs.event_id"
                filled
                dense
                :items="events.data"
                label="Event"
                item-value="id"
                class="py-0"
              >
                <template slot="selection" slot-scope="data">
                  <EventLabel :event="data.item" />
                </template>
                <template slot="item" slot-scope="data">
                  <EventLabel :event="data.item" />
                </template>
              </v-select>
            </v-col>
            <v-col cols="8" class="py-0">
              <v-text-field
                v-model="inputs.secret"
                label="Secret passcode (optional)"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <!--
        <v-switch
          v-model="inputs.is_public"
          label="Public Room"
        ></v-switch>
        -->
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="primary" :loading="loading.addRoom" @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { CREATE_ROOM_MUTATION } from '~/gql/mutation/room.js'
import { EVENTS_QUERY } from '~/gql/query/event.js'
import EventLabel from '~/components/shared/eventLabel.vue'

export default {
  components: {
    EventLabel,
  },

  props: {
    status: {
      type: Boolean,
    },
  },

  data() {
    return {
      inputs: {
        name: '',
        description: '',
        time_limit: 0,
        time_target: 0,
        max_capacity: 8,
        is_public: true,
        event_id: '1',
        secret: null,
      },

      loading: {
        addRoom: false,
      },
    }
  },

  apollo: {
    events: {
      query: EVENTS_QUERY,
    },
  },

  watch: {
    status(_val) {
      if (this.status) {
        this.reset()
      }
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async submit() {
      this.loading.addRoom = true
      try {
        if (this.inputs.secret && this.inputs.secret.length < 5) {
          throw sharedService.generateError(
            'Secret must be at least 5 characters',
          )
        }

        if (
          this.inputs.time_limit < 0 ||
          this.inputs.time_target < 0 ||
          this.inputs.max_capacity < 0
        ) {
          throw sharedService.generateError(
            'Invalid input(s), please check and try again.',
          )
        }

        if (!/\S/.test(this.inputs.name)) {
          throw sharedService.generateError('Non-empty name required')
        }

        let { data } = await this.$apollo.mutate({
          mutation: CREATE_ROOM_MUTATION,
          variables: {
            name: this.inputs.name,
            description: this.inputs.description,
            is_public: this.inputs.is_public,
            event_id: this.inputs.event_id,
            time_limit: parseInt(this.inputs.time_limit * 1000) || undefined,
            time_target: parseInt(this.inputs.time_target * 1000) || undefined,
            max_capacity: parseInt(this.inputs.max_capacity) || undefined,
            secret: this.inputs.secret || undefined,
          },

          /*
          //we will not be updating the cache directly because ROOMS_QUERY is sorted and filtered
          update: (store, { data: { createRoom } }) => {
            const data = store.readQuery({ query: ROOMS_QUERY });
            data.rooms.data.push(createRoom);
            //increment rooms count
            data.rooms.paginatorInfo.total++;
            store.writeQuery({ query: ROOMS_QUERY, data });
          },

          
          optimisticResponse: {
            __typename: 'Mutation',
            createRoom: {
              __typename: 'Room',
              id: -1,
              ...this.inputs,
              is_active: true,
              creator: {
                __typename: "Cuber",
                id: this.$store.getters['auth/user'].id,
                name: this.$store.getters['auth/user'].name
              }
            },
          },
          */
        })

        sharedService.generateSnackbar(this.$root, 'Room Added', 'success')

        this.$emit('submit', data.createRoom, this.inputs.secret)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addRoom = false
    },

    reset() {
      this.inputs = {
        name: '',
        description: '',
        time_limit: 0,
        time_target: 0,
        max_capacity: 8,
        is_public: true,
        event_id: '1',
        secret: null,
      }
    },
  },
}
</script>
