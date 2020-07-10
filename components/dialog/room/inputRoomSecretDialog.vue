<template>
  <v-dialog v-model="status" max-width="500px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-lock-question</v-icon>
        <span class="headline">Enter Room Secret</span>
      </v-card-title>
      <v-card-text class="py-0">
        <v-alert v-if="selectedItem" type="error">
          Please enter the room secret to proceed
        </v-alert>
        <v-text-field
          v-model="inputs.secret"
          label="Secret"
          filled
          dense
          class="py-0"
        ></v-text-field>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Cancel</Button>
        <Button :disabled="loading.submit" @click="submit()">Submit</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
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
        submit: false,
      },
      inputs: {
        secret: null,
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

    async submit() {
      this.loading.submit = true
      try {
        if (!this.inputs.secret) {
          throw sharedService.generateError('Secret required for this room')
        }

        this.$emit('submit', this.inputs.secret)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submit = false
    },

    reset() {
      this.inputs.secret = null
    },
  },
}
</script>
