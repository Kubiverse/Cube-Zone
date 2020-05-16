<template>
  <v-dialog v-model="status" scrollable max-width="800px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-pencil</v-icon>
        <span class="headline">Edit Room</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <div v-if="$apollo.queries.room.loading" class="text-center" style="width: 100%;">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-container v-else>
          <v-row>
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field v-model="inputs.name" label="Name" filled dense class="py-0"></v-text-field>
            </v-col>
            <v-col cols="12" sm="12" class="py-0">
              <v-textarea v-model="inputs.description" label="Description" filled dense class="py-0"></v-textarea>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field v-model="inputs.time_limit" label="Time Limit (sec) (optional)" filled dense class="py-0" type="number"  step=0.001></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field v-model="inputs.time_target" label="Time Target (sec) (optional)" filled dense class="py-0" type="number"  step=0.001></v-text-field>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-text-field v-model="inputs.max_capacity" label="Max Capacity (optional)" filled dense class="py-0" type="number"></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="primary" :loading="loading.editRoom" @click="submit()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js';
import { UPDATE_ROOM_MUTATION } from '~/gql/mutation/room.js'
import { ROOM_BASIC_QUERY } from '~/gql/query/room.js'

export default {
  data() {
    return {
      inputs: {
        name: '',
        description: '',
        time_limit: 10,
        time_target: 20,
        max_capacity: 8,
      },

      loading: {
        editRoom: false
      },
      room: null,
      events: null,
    }
  },

  props: {
    status: {
      type: Boolean
    },

    selectedItem: {

    }
  },

  apollo: {
    room: {
      query: ROOM_BASIC_QUERY,
      variables() {
        return {
          id: this.selectedItem.id
        };
      },

      result({ data }) {
        //load data into inputs
        if(data) {
          this.inputs = {
            name: data.room.name,
            description: data.room.description,
            time_limit: data.room.time_limit/1000,
            time_target: data.room.time_target/1000,
            max_capacity: data.room.max_capacity,
          }
        }
      },
      
      fetchPolicy: 'no-cache',
      
      manual: true,
      skip: true
    }
  },

  methods: {
    close() {
      this.$emit('close');
    },

    async submit() {
      this.loading.editRoom = true;
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_ROOM_MUTATION,
          variables: {
            id: this.selectedItem.id,
            name: this.inputs.name,
            description: this.inputs.description,
            time_limit: parseInt(this.inputs.time_limit*1000) || undefined,
            time_target: parseInt(this.inputs.time_target*1000) || undefined,
            max_capacity: parseInt(this.inputs.max_capacity) || undefined,
          },
        });

        sharedService.generateSnackbar(this.$root, 'Room Updated', 'success');

        this.$emit('submit', data);

        this.close();
      } catch(err) {
        sharedService.handleError(err, this.$root);
      }
      this.loading.editRoom = false;
    },

    reset() {
      this.$apollo.queries.room.skip = false;
    }
  },

  watch: {
    status(val) {
      if(this.status) {
        this.reset();
      }
    }
  },

  computed: {
    id() {
      return this.selectedItem ? this.selectedItem.id : null;
    }
  }
}
</script>