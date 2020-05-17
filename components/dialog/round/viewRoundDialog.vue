<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">View Round ID {{ roundId }}</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewRoundInterface
          :status="status"
          :round-id="roundId"
        ></ViewRoundInterface>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ViewRoundInterface from '~/components/interface/viewRoundInterface.vue'

export default {
  components: {
    ViewRoundInterface,
  },

  props: {
    status: {
      type: Boolean,
    },
    roundId: {},
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
