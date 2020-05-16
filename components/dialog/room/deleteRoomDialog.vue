<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-delete</v-icon>
        <span class="headline">Delete Room</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert type="error" v-if="selectedItem">
          Confirm Delete Room: {{ selectedItem.name }}
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="error" text :loading="loading.deleteRoom" @click="deleteRoom()">Delete</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js';
import { ROOMS_QUERY } from '~/gql/query/room.js'
import { DELETE_ROOM_MUTATION } from '~/gql/mutation/room.js'

export default {
  data() {
    return {
      loading: {
        deleteRoom: false
      }
    }
  },
  props: {
    status: {
      type: Boolean
    },
    selectedItem: {
      type: Object
    }
  },

  methods: {
    close() {
      this.$emit('close');
    },

    async deleteRoom() {
      this.loading.deleteRoom = true;
      try {        
        let { data } = await this.$apollo.mutate({
          mutation: DELETE_ROOM_MUTATION,
          variables: {
            id: this.selectedItem.id
          },

          /*
          update: (store, { data: { deleteRoom } }) => {
            const data = store.readQuery({ query: ROOMS_QUERY });

            const index = data.rooms.data.findIndex(ele => ele.id === this.selectedItem.id);
            if(index !== -1) {
              data.rooms.data.splice(index, 1);
              //decrement room count
              data.rooms.paginatorInfo.total--;
              store.writeQuery({ query: ROOMS_QUERY, data });
            }
          },
          */
        });

        sharedService.generateSnackbar(this.$root, "Room Deleted", "success");

         this.$emit('submit', data);

        this.close();
      } catch(err) {
        sharedService.handleError(err, this.$root);
      }
      this.loading.deleteRoom = false;
    },

    reset() {
    }
  },

  watch: {
    status(val) {
      if(this.status) {
        this.reset();
      }
    }
  }
}
</script>