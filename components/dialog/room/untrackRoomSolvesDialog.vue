<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-alarm-off</v-icon>
        <span class="headline">Untrack Room Solves</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert v-if="selectedItem" type="error">
          Confirm Untrack All of Your Solves From Room:
          {{ selectedItem.name }} (cannot be undone)
        </v-alert>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Cancel</Button>
        <Button
          variant="text"
          color="error"
          :loading="loading.untrackRoomSolves"
          @click="untrackRoomSolves()"
          >Confirm</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { UNTRACK_SOLVES_FROM_ROOM_MUTATION } from '~/gql/mutation/room.js'
import Button from '~/components/shared/button.vue'

export default {
  components: { Button },
  props: {
    status: {
      type: Boolean,
    },
    selectedItem: {
      type: Object,
    },
  },
  data() {
    return {
      loading: {
        untrackRoomSolves: false,
      },
    }
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

    async untrackRoomSolves() {
      this.loading.untrackRoomSolves = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UNTRACK_SOLVES_FROM_ROOM_MUTATION,
          variables: {
            room_id: this.selectedItem.id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Room Solves Untracked',
          variant: 'success',
        })

        this.$emit('room-untracked', data)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.untrackRoomSolves = false
    },

    reset() {},
  },
}
</script>
