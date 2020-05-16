<template>
  <v-dialog v-model="status" scrollable max-width="800px" @click:outside="close()" :retain-focus="false">
    <v-card v-if="selectedItem">
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">{{ selectedItem.contextualAccumulator.pivot_label }} for {{selectedItem.cuber.name }}</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewAccumulatedResultInterface :status="status" :selectedId="selectedItem.id"></ViewAccumulatedResultInterface>
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
import ViewAccumulatedResultInterface from '~/components/interface/viewAccumulatedResultInterface.vue';

export default {
  components: {
    ViewAccumulatedResultInterface
  },

  data() {
    return {
    }
  },

  props: {
    status: {
      type: Boolean
    },
    selectedItem: {}
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