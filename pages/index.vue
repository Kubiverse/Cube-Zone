<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <img src="../static/cubezone2-rect.png" alt="" style="width: 60%;" />
      </div>
      <v-card>
        <v-card-title class="headline">
          Welcome to Cube.Zone
        </v-card-title>
        <v-card-text>
          <p>
            Cube.Zone is a new online platform for social cubing. Please login
            or create an account to get started.
          </p>
          <p>
            If you have questions, comments, or feedback, please join the
            official Cube.Zone
            <a href="https://discord.gg/J2v2eQN" target="_blank" title="chat">
              Discord Channel </a
            >.
          </p>
          <p>
            Thank you for using Cube.Zone. We look forward to continuing to
            improve the platform and bringing more exciting features in the
            future.
          </p>
          <div class="text-xs-right">
            <em><small>&mdash; Cube.Zone Team</small></em>
          </div>
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn color="primary" nuxt to="/rooms">
            Get Started
          </v-btn>
        </v-card-actions>
      </v-card>

      <v-card class="mt-3">
        <v-card-title class="headline">
          Release History
        </v-card-title>
        <v-card-text>
          <div class="release">
            <span class="headline">Coming Soon...</span>
            <ul>
              <li>
                Streamer mode
              </li>
              <li>
                Online Competitions
              </li>
              <li>Ability to display your personal bests on your profile</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.1.2 (11 July 2020)</span>
            <ul>
              <li>Moved Recent Rooms button to the user menu</li>
              <li>Implemented a notifications system</li>
              <li>
                User&#39;s own messages will no longer trigger notifications or
                sounds
              </li>
              <li>Improved overall appearance of the room page</li>
              <li>
                Can now add custom accumulators to each room, such as avg5,
                number of wins (must be added at room creation)
              </li>
              <li>Can now sort room results by accumulator</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.1.1 (31 May 2020)</span>
            <ul>
              <li>Moved login/user menu to bottom left of navigation drawer</li>
              <li>Removed the top navigation bar</li>
              <li>Confirmation dialog when closing the room page</li>
              <li>Behind the scenes improvements</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.1.0 (23 May 2020)</span>
            <ul>
              <li>Can now join a room as a spectator</li>
              <li>
                Can now toggle between spectating, away, and active within a
                room
              </li>
              <li>
                Can now untrack/retrack individual solves via the cuber profile
                page
              </li>
              <li>Fix error with My Rooms page not refreshing properly</li>
              <li>
                Add hints for the current input method and inspection mode under
                the scramble
              </li>
              <li>Update room page table headers</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.7 (20 May 2020)</span>
            <ul>
              <li>
                Upgraded scramble-display package to latest, so more scrambles
                should be displaying properly
              </li>
              <li>
                Fixed a bug with the accumulated results pop up not rendering
              </li>
              <li>Fixed untracking solves from a room</li>
              <li>
                Behind the Scenes: Add linting and formatting guidelines for the
                code
              </li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.6 (16 May 2020)</span>
            <ul>
              <li>
                3D/2D scramble visualizations now available (select puzzles
                only)
              </li>
              <li>Scramble visualization is now resizeable</li>
              <li>Rooms page will now auto-refresh every 5 minutes</li>
              <li>
                Fixed an issue with light/dark mode not rendering properly
              </li>
              <li>Leaving a room will now have a confirmation dialog</li>
              <li>
                User&#39;s recent rooms are now available as a link on the left
                bar
              </li>
              <li>
                Github repository for this site has been made public at
                <a href="https://github.com/Kubiverse/Cube-Zone" target="_blank"
                  >https://github.com/Kubiverse/Cube-Zone</a
                >
                under MIT license
              </li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.5 (09 May 2020)</span>
            <ul>
              <li>
                Added support for Stackmat Gen3/Gen4 Timer inputs (can be
                toggled via room settings)
              </li>
              <li>Fixed some bugs</li>
              <li>
                Added room setting to show/hide scramble preview (where
                available)
              </li>
              <li>
                Added room setting to make the scrambler text bigger/smaller
              </li>
              <li>Chat interface is docked to bottom of screen now</li>
              <li>Hide scramble immediately after submitting your time</li>
              <li>
                Can now press Enter to confirm time (instead of holding space)
              </li>
              <li>Can now untrack solves from a specific room</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.4 (02 May 2020)</span>
            <ul>
              <li>Added support for megaminx scrambles</li>
              <li>Events lists are now sorted wherever they are shown</li>
              <li>Improved timer functionality on mobile devices</li>
              <li>
                Manual entry mode will be triggered automatically by any digit
                press
              </li>
              <li>More minor bug fixes and improvements</li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.3 (01 May 2020)</span>
            <ul>
              <li>
                Increased size of leaderboard to show up to 8 cubers at a time
                before having to scroll
              </li>
              <li>
                Added Room Settings, where you can set a variety of options that
                will be saved to your browser
                <ul>
                  <li>
                    Time Input Method: Keyboard vs Manual Input (for Stackmat
                    users)
                  </li>
                  <li>
                    Inspection Mode: Whether or not to add a standardized WCA
                    inspection timer at the beginning of each solve
                  </li>
                  <li>
                    Timer Trigger Duration: How long to hold down the spacebar
                    to trigger the timer to start (in the solving stage)
                  </li>
                </ul>
              </li>
              <li>
                Room managers/creators can now assign the manager role to other
                cubers.
              </li>
              <li>
                The manager will be marked with a green gavel and can start the
                next round in the event that someone in the room is inactive.
              </li>
              <li>
                In the rooms page, now displaying number of active cubers in
                each room, as well as some of the avatars of the room
                participants.
              </li>
              <li>
                Various other minor fixes and adjustments to improve the user
                experience.
              </li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.2 (27 Apr 2020)</span>
            <ul>
              <li>
                Added event icons to various places where an event is displayed
              </li>
              <li>
                Added visual scrambles for certain supported puzzles (credits to
                cubing.js/kpuzzle)
              </li>
            </ul>
          </div>

          <div class="release">
            <span class="headline">v1.0.1 (26 Apr 2020)</span>
            <ul>
              <li>
                Fixed issues with the timer activating at when chat was in focus
              </li>
              <li>
                If you are following some cuber you will no longer have the
                "follow!" button visible when visiting this cubers
                profile/profile card
              </li>
              <li>Improved the data shown in various dialog tables</li>
              <li>Added a light theme/dark theme toggle option</li>
              <li>User avatars should no longer be stretched</li>
              <li>
                You are no longer shown the "edit/delete" option for rooms you
                do not have permission to manage
              </li>
              <li>
                The flow for automatically removing inactive cubers from a room
                + closing inactive rooms has been improved
              </li>
            </ul>
          </div>
        </v-card-text>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  components: {},

  methods: {},
  head() {
    return {
      title: 'Home',
      meta: [
        {
          hid: 'description',
          name: 'description',
          content: 'Cube.Zone is a new online platform for social cubing',
        },
      ],
    }
  },
}
</script>

<style scoped>
.release {
  margin-bottom: 16px;
}
</style>
