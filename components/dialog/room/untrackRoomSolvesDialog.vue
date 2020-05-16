<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-alarm-off</v-icon>
        <span class="headline">Untrack Room Solves</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert type="error" v-if="selectedItem">
          Confirm Untrack All of Your Solves From Room: {{ selectedItem.name }} (cannot be undone)
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="error" text :loading="loading.untrackRoomSolves" @click="untrackRoomSolves()">Confirm</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js';
import { UNTRACK_SOLVES_FROM_ROOM_MUTATION } from '~/gql/mutation/room.js'

export default {
  data() {
    return {
      loading: {
        untrackRoomSolves: false
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

    async untrackRoomSolves() {
      this.loading.untrackRoomSolves = true;
      try {        
        let { data } = await this.$apollo.mutate({
          mutation: UNTRACK_SOLVES_FROM_ROOM_MUTATION,
          variables: {
            room_id: this.selectedItem.id
          },
        });

        sharedService.generateSnackbar(this.$root, "Room Solves Untracked", "success");

         this.$emit('room-untracked', data);

        this.close();
      } catch(err) {
        sharedService.handleError(err, this.$root);
      }
      this.loading.untrackRoomSolves = false;
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