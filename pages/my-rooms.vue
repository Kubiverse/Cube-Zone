<template>
  <v-container fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <v-card class="mt-2">
          <v-toolbar flat color="accent">
            <v-icon left>mdi-card-account-details</v-icon>
            <v-toolbar-title>
              My Recent Rooms
            </v-toolbar-title>
            <!--
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <Button class="mb-2" @click="openAddRoomDialog()">
              <v-icon left>mdi-plus</v-icon>
              New Room
            </Button>
            -->
            <v-spacer></v-spacer>
            <Button icon @click="reset()">
              <v-icon>mdi-refresh</v-icon>
            </Button>
          </v-toolbar>

          <ViewCuberRoomsInterface
            :status="true"
            :generation="generation.solves"
            :cuber="cuber"
            allow-edit
          ></ViewCuberRoomsInterface>
        </v-card>
      </v-flex>
    </v-layout>
    <AddRoomDialog
      :status="dialogs.addRoom"
      @close="dialogs.addRoom = false"
      @submit="reset"
    ></AddRoomDialog>
  </v-container>
</template>

<script>
import ViewCuberRoomsInterface from '~/components/interface/viewCuberRoomsInterface.vue'
import AddRoomDialog from '~/components/dialog/room/addRoomDialog.vue'
import { mapGetters } from 'vuex'
import Button from '~/components/shared/button.vue'

export default {
  components: {
    ViewCuberRoomsInterface,
    AddRoomDialog,
    Button,
  },

  data() {
    return {
      generation: {
        solves: 0,
      },
      dialogs: {
        addRoom: false,
      },

      loading: {},

      errorMessage: null,
    }
  },

  computed: {
    ...mapGetters({
      cuber: 'auth/user',
    }),
  },

  mounted() {
    //login required, else redirect to home
    if (!this.$store.getters['auth/user']) {
      this.$router.push('/')
    }
  },

  methods: {
    openAddRoomDialog() {
      //must be logged in
      if (!this.$store.getters['auth/user']) {
        this.$root.$emit('login-dialog', this.$route.fullPath)
        this.$notifier.showSnackbar({
          message: 'Login required',
          variant: 'error',
        })
      } else {
        this.openDialog('addRoom')
      }
    },

    openDialog(dialogName) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
      }
    },

    reset() {
      this.generation.solves++
    },
  },

  head() {
    return {
      title: 'My Rooms',
    }
  },
}
</script>

<style scoped></style>
