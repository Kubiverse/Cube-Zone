<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title v-if="cuber">
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">View Solves by {{ cuber.name }}</span>
        <v-spacer></v-spacer>
        <v-btn text @click="openCuberProfile()">
          <v-icon left>mdi-open-in-new</v-icon>
          Go To Cuber Profile
        </v-btn>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <ViewCuberSolvesInterface
          :status="status"
          :cuber="cuber"
          :filter-object="filterObject"
        ></ViewCuberSolvesInterface>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import ViewCuberSolvesInterface from '~/components/interface/viewCuberSolvesInterface.vue'

export default {
  components: {
    ViewCuberSolvesInterface,
  },

  props: {
    status: {
      type: Boolean,
    },
    cuber: {},
  },

  data() {
    return {
      filterObject: {
        event_id: null,
        is_tracked: true,
      },
    }
  },

  watch: {
    status(_val) {
      if (this.status) {
        this.reset()
      }
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    openCuberProfile() {
      let routeData = this.$router.resolve({
        name: 'cuber',
        query: { id: this.cuber.id },
      })
      window.open(routeData.href, '_blank')
    },

    reset() {},
  },
}
</script>
