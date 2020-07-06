<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card v-if="cuber">
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">Select Cuber</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewCuberFollowsInterface
          :status="status"
          :cuber="cuber"
          selectable
          @item-selected="handleItemSelect"
        ></ViewCuberFollowsInterface>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="primary" @click="submit()">Submit</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ViewCuberFollowsInterface from '~/components/interface/viewCuberFollowsInterface.vue'

export default {
  components: {
    ViewCuberFollowsInterface,
  },

  props: {
    status: {
      type: Boolean,
    },
    cuber: {},
  },

  data() {
    return {
      selected: null,
    }
  },

  watch: {},

  methods: {
    close() {
      this.$emit('close')
    },

    handleItemSelect(item) {
      this.selected = item
    },

    submit() {
      if (!this.selected) return
      this.$emit('submit', this.selected)
      this.close()
    },

    reset() {},
  },
}
</script>
