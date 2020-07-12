<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card v-if="selectedItem">
      <v-card-title>
        <v-icon left>mdi-badge-account-horizontal</v-icon>
        <span class="headline">{{ selectedItem.name }} - Members</span>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-btn color="primary" dark @click="openDialog('selectCuberFollows')">
          <v-icon left>mdi-plus</v-icon>
          Add Member
        </v-btn>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <div v-if="loading.loadData" class="text-center" style="width: 100%;">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <div v-else>
          <v-simple-table>
            <template v-slot:default>
              <thead>
                <tr>
                  <th class="text-left">Cuber</th>
                  <th class="text-left" width="100px">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="item in members" :key="item.id">
                  <td>{{ item.name }}</td>
                  <td>
                    <v-icon small @click="removeMember(item)"
                      >mdi-delete</v-icon
                    >
                  </td>
                </tr>
              </tbody>
            </template>
          </v-simple-table>
        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Close</v-btn>
      </v-card-actions>
    </v-card>
    <SelectCuberFollowsDialog
      :status="dialogs.selectCuberFollows"
      :cuber="user"
      @close="dialogs.selectCuberFollows = false"
      @submit="addMember"
    ></SelectCuberFollowsDialog>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { ORGANISATION_MEMBERS_QUERY } from '~/gql/query/organisation.js'
import {
  ADD_MEMBER_TO_ORGANISATION,
  REMOVE_MEMBER_FROM_ORGANISATION,
} from '~/gql/mutation/organisation.js'
import SelectCuberFollowsDialog from '~/components/dialog/misc/selectCuberFollowsDialog.vue'
import { mapGetters } from 'vuex'

export default {
  components: {
    SelectCuberFollowsDialog,
  },

  props: {
    status: {
      type: Boolean,
    },
    selectedItem: {},
  },

  data() {
    return {
      members: [],
      loading: {
        loadData: false,
        addMember: false,
        removeMember: false,
      },
      dialogs: {
        selectCuberFollows: false,
      },
    }
  },

  computed: {
    ...mapGetters({
      user: 'auth/user',
    }),
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

    openDialog(dialogName) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
      }
    },

    async addMember(cuber) {
      this.loading.addMember = true
      try {
        if (!cuber) {
          throw sharedService.generateError('Cuber required')
        }

        await this.$apollo.mutate({
          mutation: ADD_MEMBER_TO_ORGANISATION,
          variables: {
            organisation_id: this.selectedItem.id,
            cuber_id: cuber.id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Cuber Added',
          variant: 'success',
        })

        this.reset()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addMember = false
    },

    async removeMember(cuber) {
      this.loading.addMember = true
      try {
        if (!cuber) {
          throw sharedService.generateError('Cuber required')
        }

        await this.$apollo.mutate({
          mutation: REMOVE_MEMBER_FROM_ORGANISATION,
          variables: {
            organisation_id: this.selectedItem.id,
            cuber_id: cuber.id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Cuber Removed',
          variant: 'success',
        })

        this.reset()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addMember = false
    },

    async loadData() {
      this.loading.loadData = true
      try {
        let { data } = await this.$apollo.query({
          query: ORGANISATION_MEMBERS_QUERY,
          variables: {
            id: this.selectedItem.id,
          },
          fetchPolicy: 'no-cache',
        })

        this.members = data.organisation.members
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadData = false
    },

    reset() {
      if (!this.status) return

      this.loadData()
    },
  },
}
</script>
