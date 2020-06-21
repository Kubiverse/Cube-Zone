<template>
  <v-overlay
    absolute
    :value="status"
    :opacity="streamerMode ? 0.7 : opacity"
    :color="backgroundColor"
  >
    <v-container fluid :fill-height="!streamerMode">
      <v-layout align-center justify-center>
        <v-row>
          <v-spacer></v-spacer>
          <v-col
            :cols="streamerMode ? 4 : 12"
            align-self="end"
            class="text-center"
          >
            <v-row>
              <v-col cols="12" class="text-center">
                <span
                  v-if="
                    timerState >= 5 && (solveResult.is_dnf || isInspectionDnf)
                  "
                  class="red--text timer-text"
                  >DNF</span
                >
                <span
                  v-else
                  class="timer-text"
                  :class="{
                    'black--text': isInspecting,
                    'red--text text--lighten-4': timerState == 2,
                    'green--text text--darken-4': timerState == 3,
                  }"
                  >{{ generateTimeString(timeElapsed) }}</span
                >
                <span v-if="solveResult.penalties" class="red--text timer-text"
                  >(+{{ solveResult.penalties / 1000 }})</span
                >
                <div v-if="isInspectionDnf">
                  Your solve was DNFed due to inspection taking longer than 17
                  seconds.
                </div>
                <div v-else-if="isInspectionPenalty">
                  Your solve has incurred an extra +2 penalty because the
                  inspection took between 15 and 17 seconds.
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center" style="height: 16px;">
                <div v-if="timerState == 1" class="overline">Inspecting</div>
                <div v-else-if="timerState == 4" class="overline">Solving</div>
                <div v-else-if="timerState == 5" class="overline">
                  Verifying
                </div>
              </v-col>
              <v-col cols="12" class="text-center">
                <div v-if="inputMethod == 'manual'" class="overline">
                  Manual Entry - Please Type in the Result using your Keyboard
                </div>
                <div
                  v-if="inputMethod == 'stackmat' && timerState == 5"
                  class="overline"
                >
                  Don't forget to reset your Stackmat Timer!
                </div>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="12" class="text-center" style="height: 36px;">
                <template v-if="timerState == 5 || timerState == 6">
                  <Button color="error" @click="toggleDnf()">
                    DNF
                  </Button>
                  <Button color="warning" @click="togglePenalty()">
                    +2
                  </Button>
                  <Button
                    color="success"
                    :loading="timerState == 6"
                    @click="timerState = 7"
                  >
                    Finalize Results (or hold Space)
                  </Button>
                </template>
                <Button
                  v-else-if="timerState == 8"
                  color="warning"
                  @click="timerState = 9"
                  >Go Back</Button
                >
              </v-col>
            </v-row>
          </v-col>
        </v-row>
      </v-layout>
    </v-container>
  </v-overlay>
</template>

<script>
import sharedService from '~/services/shared.js'
import Stackmat from '~/services/stackmat.js'
import Button from '~/components/shared/button.vue'

export default {
  components: { Button },
  props: {
    disabled: {},

    inputMethod: {},
    timerTriggerDuration: {},
    inspectionTimer: {},
    streamerMode: {},
  },
  data() {
    return {
      status: false,
      timerState: 0,

      inputs: {
        manualTime: '',
      },

      solveResult: {
        time: 0,
        penalties: 0,
        is_dnf: false,
        state: 'FINISHED',
      },

      opacity: 1,

      /*
      0 - Idle
      1 - Inspecting (counting up to 15)
      2 - Space down less than 600 ms (red)
      3 - Space down more than 600 ms (green)
      4 - Space bar down (timer start)
      5 - Space bar down (timer done) - need to verify time
      6 - Space bar down less than 250 ms, to verify time
      7 - Time finalized and submitted
      8 - Acknowledge/Go Back (only if DNFed due to inspection)
      9 - Done, go back to 0
      */

      spacebarDownTimer: null,

      timeElapsed: 0,
      inspectionTimeElapsed: 0,

      timeBegan: null,
      started: null,
      running: false,

      stackmat: null,
    }
  },

  computed: {
    isInspectionPenalty() {
      return (
        this.inspectionTimeElapsed > 15000 &&
        this.inspectionTimeElapsed <= 17000
      )
    },

    isInspectionDnf() {
      return (
        (this.isInspecting && this.timeElapsed > 17000) ||
        this.inspectionTimeElapsed > 17000
      )
    },

    //is inspecting if timer is running before timerState 4
    isInspecting() {
      return this.running && this.timerState < 4
    },

    backgroundColor() {
      if (this.isInspecting) {
        if (this.timeElapsed > 17000) return 'red darken-4'
        else if (this.timeElapsed > 15000) return 'red'
        else if (this.timeElapsed > 12000) return 'orange'
        else if (this.timeElapsed > 8000) return 'yellow'
        else return 'green'
      } else {
        return '#212121'
      }
    },
  },

  watch: {
    isInspectionDnf(val) {
      //if inspection DNF state, reset the timer and skip to timerState 7
      if (val) {
        this.stop()
        this.inspectionTimeElapsed = this.timeElapsed
        this.resetTimer()
        this.opacity = 0.7
        this.timerState = 7
      }
    },

    status(val) {
      this.$emit('timer-status-updated', val)
    },

    'inputs.manualTime': function (val) {
      let ms
      //convert a string time into ms "545678" => "5:45.678"
      if (val.length > 5) {
        ms =
          parseInt(val.substring(val.length - 5)) +
          parseInt(val.substring(0, val.length - 5)) * 60 * 1000
      } else {
        ms = parseInt(val)
      }

      if (Number.isNaN(ms)) {
        this.inputs.manualTime = 0
      } else {
        this.timeElapsed = ms
      }
    },

    timerState(val, prevVal) {
      this.$emit('timer-state-updated', val)

      if (val > 0 && this.status == false) {
        this.status = true
      }

      switch (val) {
        case 1:
          //inspection start
          this.start()
          break
        case 2:
          break
        case 3:
          break
        case 4:
          //inspection end
          if (this.inspectionTimer) {
            this.stop()
            this.inspectionTimeElapsed = this.timeElapsed
            this.resetTimer()
            //if inspection penalty, add 2
            if (this.isInspectionPenalty) this.solveResult.penalties += 2000
          }

          this.start()
          //switch to "SOLVING"
          break
        case 5:
          //switch to "VERIFYING"
          //if not due to a cancelled 6 or jumped from 0
          if (prevVal != 6 && prevVal != 0) {
            if (this.inputMethod !== 'stackmat') this.stop()
            this.opacity = 0.7
          }
          break
        case 6:
          break
        case 7:
          this.submitResults()
          if (this.isInspectionDnf) this.timerState = 8
          else this.timerState = 9
          break
        case 8:
          break
        case 9:
          this.status = false
          this.reset()
          this.timerState = 0
          break
      }
    },

    inputMethod(val) {
      if (val === 'stackmat') {
        this.stackmat.start()
      } else {
        this.stackmat.stop()
      }
    },
  },

  created() {
    if (process.client) {
      window.addEventListener('keydown', this.handleKeyDown)
      window.addEventListener('keyup', this.handleKeyUp)
      window.addEventListener('touchstart', this.handleTouchStart)
      window.addEventListener('touchend', this.handleKeyUp)
      window.addEventListener('touchcancel', this.handleKeyUp)

      //listen to timer events
      this.stackmat = new Stackmat()

      this.stackmat.on('started', (_packet) => {
        //not allowed to skip inpsection if there is one
        if (
          this.timerState !== 4 &&
          (!this.inspectionTimer || this.timerState === 1)
        ) {
          this.timerState = 4
        }
      })

      this.stackmat.on('stopped', (packet) => {
        if (this.timerState == 4) {
          this.timerState = 5
          this.stop(packet.time)
        }
      })

      this.stackmat.on('reset', (_packet) => {
        if (this.timerState == 5) {
          this.timerState = 7
        }
      })

      if (this.inputMethod === 'stackmat') {
        this.stackmat.start()
      }
    }
  },
  destroyed() {
    if (process.client) {
      window.removeEventListener('keydown', this.handleKeyDown)
      window.removeEventListener('keyup', this.handleKeyUp)
      window.removeEventListener('touchstart', this.handleTouchStart)
      window.removeEventListener('touchend', this.handleKeyUp)
      window.removeEventListener('touchcancel', this.handleKeyUp)
    }
  },

  methods: {
    generateTimeString: sharedService.generateTimeString,

    handleKeyDown(e) {
      if (this.disabled) return

      //advance the timerState
      if (e.code == 'Space') {
        switch (this.timerState) {
          case 0:
            //if manual input and timerState == 0, skip to 5
            if (this.inputMethod == 'manual') this.timerState = 5
            //if no inspection timer, skip to 2 and trigger the timer
            else if (this.inputMethod == 'keyboard' && !this.inspectionTimer) {
              this.timerState = 2
              if (!this.spacebarDownTimer) {
                this.spacebarDownTimer = setTimeout(() => {
                  this.timerState++
                }, parseInt(this.timerTriggerDuration))
              }
            }
            break
          case 1:
            //if inspecting and spacebar down, advance to 2 and set spacebar timer
            //only if on keyboard mode
            if (this.inputMethod == 'keyboard') {
              this.timerState++
              if (!this.spacebarDownTimer) {
                this.spacebarDownTimer = setTimeout(() => {
                  this.timerState++
                }, parseInt(this.timerTriggerDuration))
              }
            }
            break
          case 4:
            if (this.inputMethod == 'keyboard') this.timerState++
            break
          case 5:
            this.timerState++
            break
          case 6:
            //if spacebar timer not running already, set timeout to advance
            if (!this.spacebarDownTimer) {
              this.spacebarDownTimer = setTimeout(() => {
                this.timerState++
              }, 250)
            }
            break
          case 8:
            //if spacebar down at 8, set to 9
            this.timerState = 9
            break
        }
      } else if (this.inputMethod == 'manual') {
        if (Number.isInteger(parseInt(e.key))) {
          //if it is a number, append to the manualTime input
          this.inputs.manualTime += e.key
          //if the overlay is not triggered, trigger it
          if (this.timerState != 5) this.timerState = 5
        } else if (e.key == 'Backspace') {
          this.inputs.manualTime = this.inputs.manualTime.slice(0, -1)
        }
      } else if (e.code) {
        //allow any keypress to stop the timer in keyboard mode
        if (this.inputMethod == 'keyboard' && this.timerState === 4) {
          this.timerState++
        }
      }
    },

    handleTouchStart(e) {
      if (this.disabled) return
      //advance the timerState for mobile touch
      if (e.target) {
        switch (this.timerState) {
          case 0:
            if (e.target.id != 'v-step-scramble') {
              break
            }
            //if manual input and timerState == 0, skip to 5
            if (this.inputMethod == 'manual') this.timerState = 5
            //if no inspection timer, skip to 2 and trigger the timer
            else if (!this.inspectionTimer) {
              this.timerState = 2
              if (!this.spacebarDownTimer) {
                this.spacebarDownTimer = setTimeout(() => {
                  this.timerState++
                }, parseInt(this.timerTriggerDuration))
              }
            }
            break
          case 1:
            //if inspecting and spacebar down, advance to 2 and set spacebar timer
            this.timerState++
            if (!this.spacebarDownTimer) {
              this.spacebarDownTimer = setTimeout(() => {
                this.timerState++
              }, parseInt(this.timerTriggerDuration))
            }
            break
          case 4:
            if (this.inputMethod == 'keyboard') this.timerState++
            break
          case 5:
            this.timerState++
            if (!this.spacebarDownTimer) {
              this.spacebarDownTimer = setTimeout(() => {
                this.timerState++
              }, 250)
            }
            break
          case 8:
            //if spacebar down at 8, set to 9
            this.timerState = 9
            break
        }
      }
    },

    handleKeyUp(e) {
      if (this.disabled) return
      if (e.code == 'Enter') {
        if (this.timerState == 5) {
          this.$emit('stopPropagation')
          this.timerState = 7
        }
      } else if (e.code == 'Space' || e.type.match(/^touch/)) {
        switch (this.timerState) {
          case 0:
            //if keyup at 0 and inspecting mode, advance to 1
            if (this.inspectionTimer) this.timerState++
            break
          case 2:
            //if keyup at 2, reset the spacebar timer and go back to either 1 or 0
            if (this.inspectionTimer) {
              this.timerState = 1
            } else {
              this.timerState = 0
              this.status = false
            }
            clearTimeout(this.spacebarDownTimer)
            this.spacebarDownTimer = null
            break
          case 3:
            //if keyup at 3, advance to next step
            this.timerState++
            break
          case 6:
            //if keyup at 6, reset the spacebar timer and go back
            clearTimeout(this.spacebarDownTimer)
            this.spacebarDownTimer = null
            this.timerState = 5
            break
        }
      }
    },

    togglePenalty() {
      if (this.isInspectionPenalty) {
        this.solveResult.penalties == 4000
          ? (this.solveResult.penalties -= 2000)
          : (this.solveResult.penalties += 2000)
      } else {
        this.solveResult.penalties == 2000
          ? (this.solveResult.penalties -= 2000)
          : (this.solveResult.penalties += 2000)
      }
    },

    toggleDnf() {
      this.solveResult.is_dnf = !this.solveResult.is_dnf
    },

    start() {
      if (this.running) return

      if (this.timeBegan === null) {
        this.resetTimer()
        this.timeBegan = new Date()
      }

      this.started = setInterval(() => {
        this.timeElapsed = new Date() - this.timeBegan
      }, 17)
      this.running = true
    },

    stop(overrideTime = null) {
      this.running = false
      this.timeElapsed = overrideTime || new Date() - this.timeBegan
      clearInterval(this.started)
    },

    reset() {
      this.resetTimer()

      this.inspectionTimeElapsed = 0
      this.inputs.manualTime = ''
      this.opacity = 1

      this.solveResult = {
        time: 0,
        penalties: 0,
        is_dnf: false,
        state: 'FINISHED',
      }
    },

    resetTimer() {
      this.running = false
      clearInterval(this.started)
      this.timeBegan = null
      this.timeElapsed = 0
      clearTimeout(this.spacebarDownTimer)
      this.spacebarDownTimer = null
    },

    submitResults() {
      this.solveResult.time = this.timeElapsed

      //handle inspection dnf
      if (this.isInspectionDnf) this.solveResult.is_dnf = true

      this.$emit('submit-results', this.solveResult)
    },
  },

  beforeDestroyed() {
    this.resetTimer()
  },
}
</script>

<style scoped>
.timer-text {
  font-family: 'Share Tech Mono', sans-serif;
  font-size: 6rem !important;
}
</style>

<style>
.v-overlay__content {
  width: 100%;
  height: 100%;
}
</style>
