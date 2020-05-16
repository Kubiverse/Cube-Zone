<template>
  <v-dialog v-model="status" scrollable max-width="800px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">View Round ID {{ roundId }}</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewRoundInterface :status="status" :roundId="roundId"></ViewRoundInterface>
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
import ViewRoundInterface from '~/components/interface/viewRoundInterface.vue';

export default {
  components: {
    ViewRoundInterface
  },

  data() {
    return {
    }
  },

  props: {
    status: {
      type: Boolean
    },
    roundId: {}
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