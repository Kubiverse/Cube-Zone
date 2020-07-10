<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card v-if="room">
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">{{ room.name }} - All Rounds</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewRoundsInterface
          :status="status"
          :room-id="room.id"
        ></ViewRoundsInterface>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Close</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ViewRoundsInterface from '~/components/interface/viewRoundsInterface.vue'
import Button from '~/components/shared/button.vue'

export default {
  components: {
    ViewRoundsInterface,
    Button,
  },

  props: {
    status: {
      type: Boolean,
    },
    room: {},
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
