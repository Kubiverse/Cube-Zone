<template>
  <v-container fluid>
    <v-layout
      column
      justify-left
      align-left
    >
      <v-flex
        xs12
        sm8
        md6
      >
        <v-card class="mt-2">
          <v-toolbar flat color="accent">
            <v-toolbar-title>
              My Recent Rooms
            </v-toolbar-title>
            <!--
            <v-divider
              class="mx-4"
              inset
              vertical
            ></v-divider>
            <v-btn color="primary" dark class="mb-2" @click="openAddRoomDialog()">
              <v-icon left>mdi-plus</v-icon>
              New Room
            </v-btn>
            -->
            <v-spacer></v-spacer>
            <v-btn icon @click="reset()">
              <v-icon>mdi-refresh</v-icon>
            </v-btn>
          </v-toolbar>

          <ViewCuberRoomsInterface :status="true" :generation="generation.solves" :cuber="cuber" allowEdit></ViewCuberRoomsInterface>
        </v-card>
      </v-flex>
    </v-layout>
    <AddRoomDialog :status="dialogs.addRoom" @close="dialogs.addRoom = false" @submit="reset"></AddRoomDialog>
  </v-container>
</template>

<script>
import sharedService from '~/services/shared.js';
import ViewCuberRoomsInterface from '~/components/interface/viewCuberRoomsInterface.vue';
import AddRoomDialog from '~/components/dialog/room/addRoomDialog.vue';
import { mapGetters } from 'vuex';

export default {
  middleware: "router-auth",

  head() {
    return {
      title: "My Rooms"
    }
  },

  components: {
    ViewCuberRoomsInterface,
    AddRoomDialog
  },

  data() {
    return {
      generation: {
        solves: 0,
      },
      dialogs: {
        addRoom: false,
      },

      loading: {
      },

      errorMessage: null,
    };
  },

  mounted() {
  },

  methods: {
    openAddRoomDialog() {
      //must be logged in
      if(!this.$store.getters["auth/user"]) {
        this.$root.$emit("login-dialog", this.$route.fullPath);
        sharedService.generateSnackbar(this.$root, "Login required", "error");
      } else {
        this.openDialog('addRoom');
      }
    },

    openDialog(dialogName) {
      if(dialogName in this.dialogs) {
        this.dialogs[dialogName] = true;
      }
    },

    reset() {
      this.generation.solves++;
    },
  },

  computed: {
    ...mapGetters({
      cuber: "auth/user"
    })
  }
}
</script>

<style scoped>
</style>