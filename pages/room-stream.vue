<template>
  <v-container fluid fill-height class="container-full">
    <v-layout style="padding-bottom: 100px;">
      <v-layout v-if="loadingText" justify-center align-center>
        <span class="display-1 pl-2"
          >{{ errorMessage || 'Loading Room...' }}
          <v-progress-circular
            v-if="!errorMessage"
            indeterminate
          ></v-progress-circular>
        </span>
      </v-layout>
      <div v-else style="width: 100%;">
        <template v-if="activeRound">
          <v-row justify="center">
            <v-col cols="5" class="text-center">
              <v-card height="300px" class="resizeable-card" width="100%">
                <v-layout align-center justify-center fill-height>
                  Stream Graphics Here
                </v-layout>
              </v-card>
              <div v-if="cuberResults[0]">
                <span class="title">
                  {{ cuberResults[0].cuber.name }} ({{
                    countriesMap[cuberResults[0].cuber.nationality]
                  }})
                </span>
                <v-icon
                  v-if="cuberResults[0].cuber.pivot.type === 'IDLING'"
                  small
                  title="Away"
                  >mdi-sleep</v-icon
                >
                <v-icon
                  v-else-if="cuberResults[0].cuber.pivot.type === 'SPECTATING'"
                  small
                  title="Spectating"
                  >mdi-eye</v-icon
                >
                <v-icon
                  v-else-if="cuberResults[0].cuber.pivot.type === 'VISITED'"
                  small
                  title="Not in room"
                  >mdi-exit-run</v-icon
                >
              </div>
              <i v-else>
                (None)
              </i>
            </v-col>
            <v-col cols="2">
              <v-card class="resizeable-card text-center" width="100%">
                <v-simple-table>
                  <template v-slot:default>
                    <tbody>
                      <tr v-for="round in roundsReversed" :key="round.id">
                        <td
                          style="width: 34%;"
                          class="title"
                          :class="{
                            'item-highlight':
                              cuberResults[0] && cuberResults[0].updating,
                          }"
                          v-html="renderSolveResults(round, cuberResults[0])"
                        ></td>
                        <td class="title" style="width: 33%;">
                          #{{ round.round_number }}
                        </td>
                        <td
                          class="title"
                          style="width: 34%;"
                          :class="{
                            'item-highlight':
                              cuberResults[1] && cuberResults[1].updating,
                          }"
                          v-html="renderSolveResults(round, cuberResults[1])"
                        ></td>
                      </tr>
                      <tr key="-1" class="num-wins-bg">
                        <td class="title">1</td>
                        <td class="title" style="width: 50px;">Wins</td>
                        <td class="title">5</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
            <v-col cols="5" class="text-center">
              <v-card height="300px" class="resizeable-card" width="100%">
                <v-layout align-center justify-center fill-height>
                  Stream Graphics Here
                </v-layout>
              </v-card>
              <div v-if="cuberResults[1]">
                <span class="title">
                  {{ cuberResults[1].cuber.name }} ({{
                    countriesMap[cuberResults[1].cuber.nationality]
                  }})
                </span>
                <v-icon
                  v-if="cuberResults[1].cuber.pivot.type === 'IDLING'"
                  small
                  title="Away"
                  >mdi-sleep</v-icon
                >
                <v-icon
                  v-else-if="cuberResults[1].cuber.pivot.type === 'SPECTATING'"
                  small
                  title="Spectating"
                  >mdi-eye</v-icon
                >
                <v-icon
                  v-else-if="cuberResults[1].cuber.pivot.type === 'VISITED'"
                  small
                  title="Not in room"
                  >mdi-exit-run</v-icon
                >
              </div>
              <i v-else>
                (None)
              </i>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="4">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>time</th>
                      <th>avg5</th>
                      <th>avg12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="-1">
                      <td>current</td>
                      <td>7.97</td>
                      <td>7.62</td>
                      <td>7.62</td>
                    </tr>
                    <tr key="-2">
                      <td>best</td>
                      <td>7.97</td>
                      <td>7.62</td>
                      <td>7.62</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
            <v-col cols="4" class="text-center">
              <v-card height="200px" class="resizeable-card" width="100%">
                <v-layout align-center justify-center fill-height>
                  Stream Graphics Here
                </v-layout>
              </v-card>
            </v-col>
            <v-col cols="4">
              <v-simple-table>
                <template v-slot:default>
                  <thead>
                    <tr>
                      <th>&nbsp;</th>
                      <th>time</th>
                      <th>avg5</th>
                      <th>avg12</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr key="-1">
                      <td>current</td>
                      <td>7.97</td>
                      <td>7.62</td>
                      <td>7.62</td>
                    </tr>
                    <tr key="-2">
                      <td>best</td>
                      <td>7.97</td>
                      <td>7.62</td>
                      <td>7.62</td>
                    </tr>
                  </tbody>
                </template>
              </v-simple-table>
            </v-col>
          </v-row>
          <v-row>
            <v-col cols="12" class="text-center">
              <div>
                <Scramble
                  id="v-step-scramble"
                  :scramble="activeRound.scramble"
                  :size="settingsObject.scrambleFontSize"
                />
                <div class="overline">
                  Timer input method:
                  {{ inputMethodMap[settingsObject.inputMethod] }}
                </div>
              </div>
            </v-col>
          </v-row>
        </template>
        <div v-if="room.spectating_cubers.paginatorInfo.total > 0">
          <v-row justify="center">
            <span class="caption grey--text">
              {{ room.spectating_cubers.paginatorInfo.total }} Spectator(s):
            </span>
          </v-row>
          <v-row justify="center">
            <div>
              <PreviewCuberPopover
                v-for="item in room.spectating_cubers.data"
                :key="item.id"
                :selected-item="item"
                chip
              >
              </PreviewCuberPopover>
            </div>
          </v-row>
        </div>
      </div>
    </v-layout>
    <v-footer v-if="room" absolute fixed height="auto">
      <div class="text-center pt-1" style="width: 100%;">
        <v-btn id="v-step-share" @click="copyShareLink()">Share Link</v-btn>
        <v-btn @click="openViewRoundsDialog()">All Rounds</v-btn>
        <v-btn id="v-step-settings" icon @click="openEditRoomSettingsDialog()">
          <v-icon>mdi-cog</v-icon>
        </v-btn>
      </div>
      <v-row justify="center" class="pt-1">
        <span class="caption grey--text">
          Room Name: {{ room.name }} | Event: {{ room.event.name }} | Time
          Limit: {{ room.time_limit / 1000 || 'None' }} | Time Target:
          {{ room.time_target / 1000 || 'None' }} | Max Capacity:
          {{ room.max_capacity || 'None' }}
        </span>
      </v-row>
    </v-footer>
    <ViewRoundDialog
      :round-id="lookupRoundId"
      :status="dialogs.viewRound"
      @close="dialogs.viewRound = false"
    ></ViewRoundDialog>
    <ViewRoundsDialog
      :room="room"
      :status="dialogs.viewRounds"
      @close="dialogs.viewRounds = false"
    ></ViewRoundsDialog>
    <EditRoomSettingsDialog
      :status="dialogs.editRoomSettings"
      :settings-object="settingsObject"
      @update-settings="updateSettings"
      @close="dialogs.editRoomSettings = false"
    ></EditRoomSettingsDialog>
    <ViewAccumulatedResultDialog
      :selected-item="lookupAccumulated"
      :status="dialogs.viewAccumulated"
      @close="dialogs.viewAccumulated = false"
    ></ViewAccumulatedResultDialog>
  </v-container>
</template>

<script>
import sharedService from '~/services/shared.js'
import { inputMethodMap, countriesMap } from '~/services/constants.js'
import { ROOM_QUERY } from '~/gql/query/room.js'
import { ME_ACTIVE_ROOM_QUERY } from '~/gql/query/cuber.js'
import { ROUNDS_QUERY } from '~/gql/query/round.js'
import PreviewCuberPopover from '~/components/popover/previewCuberPopover'
import ViewRoundDialog from '~/components/dialog/round/viewRoundDialog'
import ViewRoundsDialog from '~/components/dialog/round/viewRoundsDialog'
import EditRoomSettingsDialog from '~/components/dialog/misc/editRoomSettingsDialog'
import ViewAccumulatedResultDialog from '~/components/dialog/accumulated/viewAccumulatedResultDialog'
import ScrambleDisplay from '~/components/shared/scrambleDisplay.vue'
import Scramble from '~/components/shared/scramble'
import { mapGetters } from 'vuex'

export default {
  layout: 'lite',

  components: {
    PreviewCuberPopover,
    ViewRoundDialog,
    ViewRoundsDialog,
    EditRoomSettingsDialog,
    ViewAccumulatedResultDialog,
    ScrambleDisplay,
    Scramble,
  },

  data() {
    return {
      inputMethodMap,
      countriesMap,
      room: null,
      rounds: [],
      activeRound: null,

      desserts: [
        {
          name: 'Frozen Yogurt',
          calories: 159,
        },
        {
          name: 'Ice cream sandwich',
          calories: 237,
        },
        {
          name: 'Eclair',
          calories: 262,
        },
        {
          name: 'Cupcake',
          calories: 305,
        },
        {
          name: 'Gingerbread',
          calories: 356,
        },
      ],

      currentUserSolve: null,

      settingsObject: {
        inputMethod: 'keyboard',
        inspectionTimer: false,
        timerTriggerDuration: 400,
        showScramblePreview: true,
        scrambleFontSize: 32,
        enableSounds: true,
        scramblePreviewVisualization: '2D',
      },

      accumulatedResults: [
        {
          name: 'avg5',
          type_id: '1',
          pivot_n: '5',
        },
        {
          name: 'avg12',
          type_id: '1',
          pivot_n: '12',
        },
      ],

      tableRounds: 6,

      solvesMap: {},

      cuberResults: [],

      loading: {
        joiningRoom: false,
        startingNextRound: false,
        updatingSolve: false,
        assigningManager: false,
      },

      dialogs: {
        viewRound: false,
        viewRounds: false,
        viewAccumulated: false,
        editRoomSettings: false,
      },

      lookupRoundId: null,
      lookupAccumulated: null,

      errorMessage: null,
      timerState: 0,
      timerStatus: false,

      cuberStatusOptions: [
        { value: 'PARTICIPATING', text: 'Active' },
        { value: 'IDLING', text: 'Away' },
        { value: 'SPECTATING', text: 'Spectating' },
      ],

      cuberStatusMap: {
        VISITED: 'Left',
        PARTICIPATING: 'Active',
        IDLING: 'Away',
        SPECTATING: 'Spectating',
      },

      subscriptions: {
        roundFinished: (data) => {
          let foundRound = this.rounds.find(
            (round) => round.id == data.roundFinished.id,
          )

          if (foundRound) {
            this.updateObject(foundRound, data.roundFinished)
          }
        },
        roundStarted: (data) => {
          this.rounds.unshift(data.roundStarted)

          this.updateActiveRound(data.roundStarted)

          this.findCurrentUserSolve()
          this.updateSolvesMap([data.roundStarted])
          this.cuberResults.length
            ? this.addCuberResults(data.roundStarted)
            : this.buildCuberResults()
          this.checkCuberResults()
          this.triggerGarbageCollection()
          this.loading.startingNextRound = false

          //to-do: clear any cuberResult timers
        },
        solveUpdated: (data) => {
          if (data.solveUpdated.id in this.solvesMap) {
            this.updateObject(
              this.solvesMap[data.solveUpdated.id],
              data.solveUpdated,
            )
          }

          const cuberResult = this.cuberResults.find(
            (cuber) => cuber.id == data.solveUpdated.cuber.id,
          )

          //if solve is inspecting, start the timer
          if (data.solveUpdated.state === 'INSPECTING') {
            this.startCuberTimer(cuberResult)
          }

          //if solve is solving, (re)start the timer
          if (data.solveUpdated.state === 'SOLVING') {
            this.stopCuberTimer(cuberResult)
            this.startCuberTimer(cuberResult)
          }

          //if solve is verifying, stop the timer
          if (data.solveUpdated.state === 'VERIFYING') {
            this.stopCuberTimer(cuberResult)
          }

          this.flashResultUpdating(cuberResult)
        },
        roomUpdated: (data) => {
          Object.assign(this.room, data.roomUpdated)
        },
        roomMemberStatusUpdated: (data) => {
          data.roomMemberStatusUpdated.cuber.pivot = {
            type: data.roomMemberStatusUpdated.type,
          }
          this.updateActiveCubers([data.roomMemberStatusUpdated.cuber])
        },
      },
    }
  },

  computed: {
    roundsReversed() {
      return Array.isArray(this.rounds) ? this.rounds.slice().reverse() : []
    },

    loadingText() {
      if (this.errorMessage) return this.errorMessage
      else if (
        this.$apollo.queries.room.loading ||
        this.$apollo.queries.rounds.loading
      )
        return 'Loading Room...'
      else if (!this.room) return 'Initializing Room'
      else return null
    },
    activeRoundNumber() {
      return this.activeRound ? this.activeRound.round_number : 0
    },
    isRoomManager() {
      if (!this.room) return false
      if (this.room.creator && this.room.creator.id == this.user.id) {
        return true
      }

      if (this.room.manager && this.room.manager.id == this.user.id) {
        return true
      }

      return false
    },
    ...mapGetters({
      user: 'auth/user',
    }),
  },

  watch: {
    user(val) {
      if (val) {
        this.reset()
      }
    },
  },

  mounted() {
    //attempt to join room
    this.reset()

    if (process.client) {
      window.addEventListener('storage', this.handleMessageReceived)
    }
  },

  destroyed() {
    if (process.client) {
      window.removeEventListener('storage', this.handleMessageReceived)
    }
  },

  methods: {
    generateTimeString: sharedService.generateTimeString,

    startCuberTimer(cuberResult) {
      if (cuberResult.timeBegan === null) {
        cuberResult.timeBegan = new Date()
      }

      cuberResult.timer = setInterval(() => {
        cuberResult.timeElapsed = new Date() - cuberResult.timeBegan
      }, 17)
    },

    stopCuberTimer(cuberResult) {
      cuberResult.timeBegan = null
      clearInterval(cuberResult.timer)
    },

    handleMessageReceived(event) {
      for (const subscription in this.subscriptions) {
        if (
          event.key === subscription + '-' + this.$route.query.id &&
          event.newValue
        ) {
          this.subscriptions[subscription](JSON.parse(event.newValue))
          break
        }
      }
    },

    updateSettings(settingsObject) {
      Object.assign(this.settingsObject, settingsObject)

      //save settings to localStorage
      if (process.client) {
        localStorage.setItem(
          'roomStreamSettings',
          JSON.stringify(this.settingsObject),
        )
      }

      this.$notifier.showSnackbar({
        message: 'Settings Saved',
        variant: 'success',
      })
    },

    //checks the rounds and deletes any historical rounds and references to solves
    triggerGarbageCollection() {
      while (this.rounds.length > this.tableRounds) {
        const round = this.rounds.pop()
        round.solves.forEach((solve) => {
          delete this.solvesMap[solve.id]
        })
      }
    },

    renderSolveResults(round, cuberResult) {
      if (!round || !cuberResult) return ''

      //render time if the timer has started AND is current round
      if (round === this.activeRound && cuberResult.timeBegan) {
        return sharedService.generateTimeString(cuberResult.timeElapsed)
      }

      let foundSolve = round.solves.find(
        (solve) => solve.cuber.id === cuberResult.id,
      )

      if (!foundSolve) return ''

      return (
        '<span' +
        (foundSolve.is_winner ? " class='winner-text'" : '') +
        '>' +
        sharedService.generateSolveString(
          foundSolve,
          round.round_number === this.activeRoundNumber,
        ) +
        '</span>'
      )
    },

    renderAccumulatedResults(cuberId, accItemObject) {
      if (!this.rounds[1] || !this.rounds[1].accumulated_results) return 'N/A'

      let foundResult = this.findAccumulatedResult(cuberId, accItemObject)

      if (!foundResult) return 'N/A'

      return (
        '<span' +
        (foundResult.is_winner ? " class='winner-text'" : '') +
        '>' +
        sharedService.generateAccumulatedResultString(foundResult) +
        '</span>'
      )
    },

    findAccumulatedResult(cuberId, accItemObject) {
      return this.rounds[1].accumulated_results.find(
        (accumulator) =>
          accumulator.contextualAccumulator.type_id === accItemObject.type_id &&
          accumulator.contextualAccumulator.pivot_n === accItemObject.pivot_n &&
          accumulator.cuber.id == cuberId,
      )
    },
    copyShareLink() {
      sharedService.copyToClipboard(this, window.location.href)
    },

    openViewRoundDialog(round) {
      this.lookupRoundId = round.id
      this.dialogs.viewRound = true
    },

    openEditRoomSettingsDialog() {
      this.dialogs.editRoomSettings = true
    },

    openViewAccumulatedResultDialog(cuberId, accItemObject) {
      let accumulated = this.findAccumulatedResult(cuberId, accItemObject)

      if (!accumulated) return

      this.lookupAccumulated = accumulated
      this.dialogs.viewAccumulated = true
    },

    openViewRoundsDialog() {
      this.dialogs.viewRounds = true
    },

    updateObject(oldObject, newObject) {
      for (let prop in oldObject) {
        if (prop !== 'id' && prop in newObject) {
          //if prop is_winner and the old value was true, skip updating it
          if (prop === 'is_winner' && oldObject[prop] === true) {
            continue
          }
          oldObject[prop] = newObject[prop]
        }
      }
    },

    updateSolvesMap(rounds) {
      rounds.forEach((round) => {
        round.solves.forEach((solve) => {
          this.solvesMap[solve.id] = solve
        })
      })
    },

    updateActiveRound(round) {
      this.activeRound = round || null
    },

    //adds an array of active cubers to the cuberResults, if not already in there
    updateActiveCubers(activeCubers, initialLoad) {
      if (!Array.isArray(activeCubers)) return
      activeCubers.forEach((active_cuber) => {
        let foundResult = this.cuberResults.find(
          (cuber) => cuber.id == active_cuber.id,
        )

        if (!foundResult) {
          //if joining as spectator or visited, do not add to cuberResults
          if (
            active_cuber.pivot.type !== 'SPECTATING' &&
            active_cuber.pivot.type !== 'VISITED'
          ) {
            this.cuberResults.push({
              id: active_cuber.id,
              cuber: active_cuber,
              updating: false,
              recentActiveRound: null,
              timeElapsed: 0,
              timeBegan: null,
              timer: null,
            })
          }
        } else if (foundResult) {
          //update the cuber status
          foundResult.cuber.pivot = active_cuber.pivot

          //if cuber status is spectating or visited, user should be removed from cuberResults if they did not participate.
          if (
            active_cuber.pivot.type === 'SPECTATING' ||
            active_cuber.pivot.type === 'VISITED'
          ) {
            //if result not found, remove if cuber didn't participate
            if (!foundResult.recentActiveRound) {
              let index = this.cuberResults.indexOf(foundResult)
              if (index !== -1) {
                this.cuberResults.splice(index, 1)
              }
            }
          }
        }

        //if cuber is spectating, add to room.spectating_cubers if not exists
        if (active_cuber.pivot.type === 'SPECTATING') {
          const foundSpectator = this.room.spectating_cubers.data.find(
            (cuber) => cuber.id === active_cuber.id,
          )

          if (!foundSpectator) {
            this.room.spectating_cubers.data.unshift(active_cuber)
            this.room.spectating_cubers.paginatorInfo.total++
          }
        } else {
          //else, check the room.spectating_cubers and remove if in there
          const foundSpectator = this.room.spectating_cubers.data.find(
            (cuber) => cuber.id === active_cuber.id,
          )

          if (foundSpectator) {
            const index = this.room.spectating_cubers.data.indexOf(
              foundSpectator,
            )
            if (index !== -1) {
              this.room.spectating_cubers.data.splice(index, 1)
              this.room.spectating_cubers.paginatorInfo.total--
            }
          }
        }
      })
    },

    //builds the cuberResults array from all rounds provided.
    buildCuberResults() {
      this.rounds.forEach((round) => {
        round.solves.forEach((solve) => {
          const foundResult = this.cuberResults.find(
            (cuber) => cuber.id == solve.cuber.id,
          )

          //if not found, means that cuber must be of type VISITED
          if (!foundResult) {
            this.cuberResults.push({
              id: solve.cuber.id,
              cuber: {
                ...solve.cuber,
                pivot: {
                  type: 'VISITED',
                },
              },
              updating: false,
              recentActiveRound: round,
              timeElapsed: 0,
              timeBegan: null,
              timer: null,
            })
          } else {
            foundResult.recentActiveRound = round
          }
        })
      })
    },

    flashResultUpdating(cuberResult) {
      if (!cuberResult) return
      cuberResult.updating = true
      setTimeout(() => {
        cuberResult.updating = false
      }, 1000)
    },

    //adds the cuber results from a specific new round
    addCuberResults(round) {
      //add any new cubers in the solves to cuberResults
      round.solves.forEach((solve) => {
        let foundResult = this.cuberResults.find(
          (cuber) => cuber.id == solve.cuber.id,
        )

        //if not found, means that cuber must be of type VISITED (should probably never happen)
        if (!foundResult) {
          this.cuberResults.push({
            id: solve.cuber.id,
            cuber: {
              ...solve.cuber,
              pivot: {
                type: 'VISITED',
              },
            },
            updating: false,
            recentActiveRound: round,
            timeElapsed: 0,
            timeBegan: null,
            timer: null,
          })
        } else {
          foundResult.recentActiveRound = round
        }
      })
    },

    //looks in the active round and finds the solve that belongs to the current user, if any.
    findCurrentUserSolve() {
      if (!this.activeRound || !this.$store.getters['auth/user']) {
        return
      }

      const currentUserId = this.$store.getters['auth/user'].id
      const solve = this.activeRound.solves.find(
        (ele) => ele.cuber.id == currentUserId,
      )

      this.currentUserSolve = solve || null
    },

    //checks the cuber results to see if anyone needs to be removed (if past 5 results are all null)
    checkCuberResults() {
      for (let i = this.cuberResults.length - 1; i >= 0; i--) {
        //detect if off the scoreboard (allow to remain on scoreboard if not spectating or visited)
        if (
          !this.cuberResults[i].recentActiveRound ||
          (this.cuberResults[i].recentActiveRound.round_number <=
            this.activeRoundNumber - this.tableRounds &&
            (this.cuberResults[i].cuber.pivot.type === 'SPECTATING' ||
              this.cuberResults[i].cuber.pivot.type === 'VISITED'))
        ) {
          this.cuberResults.splice(i, 1)
        }
      }
    },

    async loadRoom() {
      try {
        //must be logged in
        if (!this.$store.getters['auth/user']) {
          throw sharedService.generateError('Login required to stream room.')
        }

        //will NOT be joining the room (should already be joined)
        //check if the user's active room is this room
        let { data } = await this.$apollo.query({
          query: ME_ACTIVE_ROOM_QUERY,
          fetchPolicy: 'no-cache',
        })

        if (data.me?.active_room?.id !== this.$route.query.id) {
          throw sharedService.generateError('Must be joined to stream room.')
        }

        this.$apollo.queries.room.skip = false
      } catch (err) {
        sharedService.handleError(err, this.$root)
        this.errorMessage = sharedService.sanitizeErrorMessage(err.message)
      }
    },

    reset() {
      this.errorMessage = null

      //load room settings
      if (process.client) {
        const savedSettings =
          localStorage.getItem('roomStreamSettings') ||
          localStorage.getItem('roomSettings')
        if (savedSettings) {
          const parsedSettings = JSON.parse(savedSettings)

          for (const prop in this.settingsObject) {
            if (prop in parsedSettings) {
              this.settingsObject[prop] = parsedSettings[prop]
            }
          }
        }
      }

      this.loadRoom()
    },
  },

  head() {
    return {
      title:
        'Room' + (this.room ? ' - ' + this.room.name : '') + ' (Streamer Mode)',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Cube.Zone is a new online platform for social cubing',
        },
      ],
    }
  },

  apollo: {
    room: {
      query: ROOM_QUERY,
      variables() {
        return {
          id: this.$route.query.id,
        }
      },
      manual: true,
      skip: true,
      result({ data }) {
        //load the first response only. the subsequent responses are corrupted
        if (data?.room && !this.room) {
          this.room = data.room

          //allow rounds query to start after this is done.
          this.$apollo.queries.rounds.skip = false
        }
      },
    },

    rounds: {
      query: ROUNDS_QUERY,
      variables() {
        return {
          first: this.tableRounds,
          page: 0,
          sorting: ['ROUND_NUMBER_DESC'],
          room_id: this.$route.query.id,
        }
      },
      manual: true,
      skip: true,
      result({ data }) {
        if (data) {
          if (this.cuberResults.length) {
            //subsequent load (due to subscription)
          } else {
            this.rounds = data.rounds.data
            //initial load
            this.updateActiveRound(this.rounds[0])
            this.findCurrentUserSolve()
            this.updateSolvesMap(this.rounds)
            this.updateActiveCubers(this.room.active_cubers.data, true)
            this.buildCuberResults()
          }
        }
      },
    },
  },
}
</script>

<style scoped>
@keyframes yellowfade {
  from {
    background: yellow;
  }
  to {
    background: transparent;
  }
}

.item-highlight {
  animation: yellowfade 1s;
}

.num-wins-bg {
  background: orange;
}

.td-border-left {
  border-left: thin solid rgba(255, 255, 255, 0.12);
}

.pointer-cursor {
  cursor: pointer;
}

.container-collapsed {
  max-height: calc(100% - 320px);
}

.container-full {
  max-height: 100%;
}

.resizeable-card {
  resize: vertical;
  overflow: auto;
  display: inline-block;
}

.resizeable-scramble {
  resize: vertical;
  overflow: hidden;
}
</style>

<style>
#roomResults > .v-data-table__wrapper {
  max-height: 500px;
}

.winner-text {
  color: green;
  font-weight: bold;
}
</style>
