<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    :retain-focus="false"
    @click:outside="close()"
  >
    <v-card v-if="selectedItem">
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline"
          >{{ selectedItem.contextualAccumulator.pivot_label }} for
          {{ selectedItem.cuber.name }}</span
        >
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewAccumulatedResultInterface
          :status="status"
          :selected-id="selectedItem.id"
        ></ViewAccumulatedResultInterface>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ViewAccumulatedResultInterface from '~/components/interface/viewAccumulatedResultInterface.vue'

export default {
  components: {
    ViewAccumulatedResultInterface,
  },

  props: {
    status: {
      type: Boolean,
    },
    selectedItem: {},
  },

  data() {
    return {}
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

    reset() {},
  },
}
</script>
