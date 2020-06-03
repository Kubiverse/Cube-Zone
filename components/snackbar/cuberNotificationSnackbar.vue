<template>
  <v-snackbar
    v-if="status && currentNotification"
    v-model="open"
    :timeout="0"
    :color="variant"
    bottom
    right
    :multi-line="true"
  >
    <template
      v-if="currentNotification.__classname === 'RoomInvitationNotification'"
    >
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img
            v-if="currentNotification.initiator.avatar"
            :src="currentNotification.initiator.avatar"
          />
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>

        <v-list-item-content style="max-width: 300px;">
          <v-list-item-title :style="{ color: textColor }"
            >Room Invitation</v-list-item-title
          >
          <v-list-item-subtitle :style="{ color: textColor }"
            >{{ currentNotification.initiator.name }} has invited you to join
            {{ currentNotification.room.name }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-btn color="primary" @click="joinRoom(currentNotification.room)"
        >Join Room</v-btn
      >
    </template>
    <template
      v-else-if="
        currentNotification.__classname === 'FollowerReceivedNotification'
      "
    >
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img
            v-if="currentNotification.initiator.avatar"
            :src="currentNotification.initiator.avatar"
          />
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>

        <v-list-item-content style="max-width: 300px;">
          <v-list-item-title :style="{ color: textColor }"
            >New Follower</v-list-item-title
          >
          <v-list-item-subtitle :style="{ color: textColor }"
            >{{ currentNotification.initiator.name }} has started following
            you</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-btn
        color="primary"
        @click="openCuberProfile(currentNotification.initiator)"
        >View Profile</v-btn
      >
    </template>
    <template
      v-else-if="
        currentNotification.__classname === 'FollowsJoinedRoomNotification'
      "
    >
      <v-list-item two-line>
        <v-list-item-avatar>
          <v-img
            v-if="currentNotification.initiator.avatar"
            :src="currentNotification.initiator.avatar"
          />
          <v-icon v-else>mdi-account</v-icon>
        </v-list-item-avatar>

        <v-list-item-content style="max-width: 300px;">
          <v-list-item-title :style="{ color: textColor }"
            >Someone you follow joined a room</v-list-item-title
          >
          <v-list-item-subtitle :style="{ color: textColor }"
            >{{ currentNotification.initiator.name }} has just joined
            {{ currentNotification.room.name }}</v-list-item-subtitle
          >
        </v-list-item-content>
      </v-list-item>
      <v-btn color="primary" @click="joinRoom(currentNotification.room)"
        >Join Room</v-btn
      >
    </template>
    <v-btn :style="{ color: textColor }" text @click="handleClose()">
      {{
        messagesCount > 1 ? 'Next (' + (messagesCount - 1) + ')' : 'Close'
      }}</v-btn
    >
  </v-snackbar>
</template>

<script lang="ts">
import { mapGetters } from 'vuex'

export default {
  props: {
    status: {}
  },
  data() {
    return {
      open: false,

      variant: 'success',
      message: '',
      title: '',
      variantToTextColorMap: {
        success: '#082218',
        warning: '#2A150D',
        error: '#FFF8F8',
        info: '#050709',
      },
    }
  },
  computed: {
    textColor: function () {
      return this.variantToTextColorMap[this.variant]
    },
    ...mapGetters({
      currentNotification: 'cuberNotification/firstMessage',
      messagesCount: 'cuberNotification/messagesCount',
    }),
  },
  watch: {
    currentNotification(val, prevVal) {
      //if same notification, dont trigger
      if (val === prevVal) {
        return
      }
      //if there is another message and snackbar already open, close and re-open snackbar after 1 sec
      if (val && this.open) {
        this.open = false

        if (this.currentNotification) {
          setTimeout(() => {
            this.open = true
          }, 400)
        }
      } else {
        this.open = !!val
      }
    },
  },
  methods: {
    handleClose() {
      this.$store.commit('cuberNotification/removeFirstMessage')
    },

    joinRoom(room) {
      this.$router.push({
        path: '/room',
        query: {
          id: room.id,
        },
      })
      this.handleClose()
    },

    openCuberProfile(cuber) {
      let routeData = this.$router.resolve({
        name: 'cuber',
        query: { id: cuber.id },
      })
      window.open(routeData.href, '_blank')
    },
  },
}
</script>
