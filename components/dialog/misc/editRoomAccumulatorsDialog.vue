<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-pencil</v-icon>
        <span class="headline">Edit Room Accumulators</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <v-row>
          <v-col cols="12" class="py-0">
            <div>Visible Accumulators: (drag to change the order)</div>
            <draggable v-model="inputs.showAccumulators" group="accumulators">
              <v-chip
                v-for="(item, index) in inputs.showAccumulators"
                :key="item.type_id + '-' + item.pivot_n"
                close
                class="ma-2"
                @click:close="hideAccumulator(index)"
                >{{ item.name }} of {{ item.pivot_n || 'Session' }}</v-chip
              >
            </draggable>
          </v-col>
        </v-row>
        <v-row>
          <v-col cols="12" class="py-0">
            <div>Hidden Accumulators:</div>
            <draggable v-model="inputs.hideAccumulators" group="accumulators">
              <v-chip
                v-for="item in inputs.hideAccumulators"
                :key="item.type_id + '-' + item.pivot_n"
                class="ma-2"
                >{{ item.name }} of {{ item.pivot_n || 'Session' }}</v-chip
              >
            </draggable>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn color="primary" @click="submit()">Apply</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import draggable from 'vuedraggable'

export default {
  components: {
    draggable,
  },

  props: {
    status: {
      type: Boolean,
    },

    showAccumulators: {
      type: Array,
      default: () => [],
    },

    accumulators: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      inputs: {
        showAccumulators: [],
        hideAccumulators: [],
      },
    }
  },

  watch: {
    status(_val) {
      this.reset()
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    hideAccumulator(index) {
      this.inputs.hideAccumulators.push(this.inputs.showAccumulators[index])
      this.inputs.showAccumulators.splice(index, 1)
    },

    submit() {
      this.$emit('submit', this.inputs.showAccumulators)
      this.close()
    },

    reset() {
      if (!this.status) return

      const hideAccumulators = this.accumulators.reduce((total, item) => {
        const index = this.showAccumulators.indexOf(item)

        if (index === -1) {
          total.push(item)
        }
        return total
      }, [])

      this.inputs = {
        showAccumulators: this.showAccumulators.slice(),
        hideAccumulators: hideAccumulators,
      }
    },
  },
}
</script>
