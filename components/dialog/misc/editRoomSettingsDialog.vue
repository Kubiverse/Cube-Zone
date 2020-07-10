<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-cog</v-icon>
        <span class="headline">Room Settings</span>
      </v-card-title>

      <v-card-text v-if="inputs" style="max-height: 600px;">
        <v-row>
          <v-col cols="4" class="py-0">
            <v-select
              v-model="inputs.inputMethod"
              filled
              dense
              :items="inputMethods"
              label="Time Input Method"
            >
            </v-select>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-text-field
              v-model="inputs.timerTriggerDuration"
              label="Timer Trigger Duration (ms)"
              filled
              type="number"
              min="0"
              hint="Enter 0 for short tap"
            ></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-switch
              v-if="inputs.inputMethod != 'manual'"
              v-model="inputs.inspectionTimer"
              label="Inspection Timer"
            ></v-switch>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-switch
              v-model="inputs.showScramblePreview"
              label="Show Scramble Preview (if available)"
            ></v-switch>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-select
              v-if="inputs.showScramblePreview"
              v-model="inputs.scramblePreviewVisualization"
              filled
              dense
              :items="scrambleVisualizationOptions"
              label="Scramble Visualization"
            >
            </v-select>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-text-field
              v-model="inputs.scrambleFontSize"
              label="Scramble Font Size"
              filled
              type="number"
              min="0"
              hint="Default 32"
            ></v-text-field>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-switch
              v-model="inputs.enableSounds"
              label="Enable Sound Effects"
            ></v-switch>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-switch
              v-model="inputs.streamerMode"
              label="Streamer Mode"
            ></v-switch>
          </v-col>
        </v-row>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Cancel</Button>
        <Button @click="submit()">Apply</Button>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import Button from '~/components/shared/button.vue'

export default {
  components: { Button },

  props: {
    status: {
      type: Boolean,
    },

    settingsObject: {},
  },

  data() {
    return {
      inputs: null,

      inputMethods: [
        { text: 'Keyboard (Space Bar)', value: 'keyboard' },
        { text: 'Manual Entry', value: 'manual' },
        { text: 'Stackmat Timer', value: 'stackmat' },
      ],

      scrambleVisualizationOptions: [
        { text: '2D', value: '2D' },
        { text: '3D (Select Puzzles Only)', value: '3D' },
      ],
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

    submit() {
      this.$emit('update-settings', this.inputs)
      this.close()
    },

    reset() {
      if (!this.status) return
      this.inputs = Object.assign({}, this.settingsObject)
    },
  },
}
</script>
