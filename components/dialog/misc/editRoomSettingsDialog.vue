<template>
  <v-dialog v-model="status" scrollable max-width="800px" @click:outside="close()">
    <v-card>
      <v-card-title>
        <v-icon left>mdi-cog</v-icon>
        <span class="headline">Room Settings</span>
      </v-card-title>

      <v-card-text v-if="inputs" style="max-height: 600px;">
        <v-row>
          <v-col cols="4" class="py-0">
            <v-select
              filled
              dense
              :items="inputMethods"
              v-model="inputs.inputMethod"
              label="Time Input Method"
            >
            </v-select>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-text-field v-model="inputs.timerTriggerDuration" label="Timer Trigger Duration (ms)" filled type="number" min=0 hint="Enter 0 for short tap"></v-text-field>
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
              filled
              dense
              :items="scrambleVisualizationOptions"
              v-model="inputs.scramblePreviewVisualization"
              label="Scramble Visualization"
            >
            </v-select>
          </v-col>
          <v-col cols="4" class="py-0">
            <v-text-field v-model="inputs.scrambleFontSize" label="Scramble Font Size" filled type="number" min=0 hint="Default 32"></v-text-field>
          </v-col>
        </v-row>
        <v-col cols="4" class="py-0">
          <v-switch
            v-model="inputs.enableSounds"
            label="Enable Sound Effects"
          ></v-switch>
        </v-col>
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
import sharedService from '~/services/shared.js';

export default {
  components: {
  },

  data() {
    return {
      inputs: null,

      inputMethods: [
        { text: "Keyboard", value: "keyboard" },
        { text: "Manual Entry", value: "manual" },
        { text: "Stackmat Timer", value: "stackmat" },
      ],

      scrambleVisualizationOptions: [
        { text: "2D", value: "2D" },
        { text: "3D (Not available on all puzzles)", value: "3D" },
      ],
    };
  },

  props: {
    status: {
      type: Boolean
    },

    settingsObject: {}
  },

  methods: {
    close() {
      this.$emit('close');
    },

    submit() {
      this.$emit("update-settings", this.inputs);
      this.close();
    },

    reset() {
      if(!this.status) return;
      this.inputs = Object.assign({}, this.settingsObject);
    }
  },

  watch: {
    status(val) {
      this.reset();
    }
  },
}
</script>