<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-info</v-icon>
        <span class="headline">Instructions</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        If you are the room owner, click "Start Room"
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Close</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from '~/components/shared/button.vue'

export default {
  components: {
    Button,
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
