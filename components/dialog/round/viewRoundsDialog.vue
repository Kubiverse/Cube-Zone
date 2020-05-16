<template>
  <v-dialog v-model="status" scrollable max-width="800px" @click:outside="close()">
    <v-card v-if="room">
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">{{ room.name }} - All Rounds</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewRoundsInterface :status="status" :roomId="room.id"></ViewRoundsInterface>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js';
import ViewRoundsInterface from '~/components/interface/viewRoundsInterface.vue';

export default {
  components: {
    ViewRoundsInterface
  },

  data() {
    return {
    }
  },

  props: {
    status: {
      type: Boolean
    },
    room: {}
  },

  methods: {
    close() {
      this.$emit('close');
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
  },
}
</script>