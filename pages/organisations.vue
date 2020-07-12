<template>
  <v-container fluid>
    <v-layout column justify-left align-left>
      <v-flex xs12 sm8 md6>
        <div class="pt-2">
          <v-data-table
            :headers="headers"
            :items="organisations.data"
            class="elevation-1"
            :loading="$apollo.queries.organisations.loading"
            :options.sync="options"
            loading-text="Loading... Please wait"
            :server-items-length="organisations.paginatorInfo.total"
            multi-sort
            :footer-props="footerOptions"
            @update:options="handleUpdateOptions"
          >
            <template v-slot:top>
              <v-toolbar flat color="accent">
                <v-icon left>mdi-domain</v-icon>
                <v-toolbar-title>My Organisations</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-btn
                  color="primary"
                  dark
                  class="mb-2"
                  @click="openAddOrganisationDialog()"
                >
                  <v-icon left>mdi-plus</v-icon>
                  New Organisation
                </v-btn>
                <v-spacer></v-spacer>
                <v-btn icon @click="reset()">
                  <v-icon>mdi-refresh</v-icon>
                </v-btn>
              </v-toolbar>
            </template>
            <template v-slot:item="props">
              <tr
                :key="props.item.id"
                class="pointer-cursor"
                :class="{ 'selected-bg': isCurrentOrganisation(props.item) }"
                @click="enterOrganisation(props.item)"
              >
                <td class="text-xs-left">
                  <v-avatar size="24" class="mr-2">
                    <v-img v-if="props.item.logo" :src="props.item.logo" />
                    <v-icon v-else>mdi-domain</v-icon>
                  </v-avatar>
                  {{ props.item.name }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.website }}
                </td>
                <td class="text-xs-left">
                  {{ props.item.email }}
                </td>
                <td class="text-xs-left">
                  <v-icon
                    small
                    title="Select Organisation"
                    @click.stop="enterOrganisation(props.item)"
                    >mdi-location-enter</v-icon
                  >
                  <v-icon
                    small
                    @click.stop="openEditOrganisationDialog(props.item)"
                    >mdi-pencil</v-icon
                  >
                  <v-icon
                    small
                    @click.stop="openEditOrganisationManagersDialog(props.item)"
                    >mdi-account</v-icon
                  >
                </td>
              </tr>
            </template>
            <template v-slot:no-data>
              No organisations
            </template>
          </v-data-table>
        </div>
      </v-flex>
    </v-layout>
    <AddOrganisationDialog
      :status="dialogs.addOrganisation"
      @close="dialogs.addOrganisation = false"
      @submit="addItem"
    ></AddOrganisationDialog>
    <EditOrganisationDialog
      :status="dialogs.editOrganisation"
      :selected-item="selectedItem"
      @close="dialogs.editOrganisation = false"
      @submit="editItem"
    ></EditOrganisationDialog>
    <EditOrganisationManagersDialog
      :status="dialogs.editOrganisationManagers"
      :selected-item="selectedItem"
      @close="dialogs.editOrganisationManagers = false"
      @submit="editItem"
    ></EditOrganisationManagersDialog>
  </v-container>
</template>

<script>
import { booleanOptionsArray } from '~/services/constants.js'
import { ORGANISATIONS_QUERY } from '~/gql/query/organisation.js'

import AddOrganisationDialog from '~/components/dialog/organisation/addOrganisationDialog.vue'
import EditOrganisationDialog from '~/components/dialog/organisation/editOrganisationDialog.vue'
import EditOrganisationManagersDialog from '~/components/dialog/organisation/editOrganisationManagersDialog.vue'

export default {
  components: {
    AddOrganisationDialog,
    EditOrganisationDialog,
    EditOrganisationManagersDialog,
  },

  data() {
    return {
      booleanOptionsArray,

      organisations: {
        paginatorInfo: {
          total: 0,
          count: 0,
        },
        data: [],
      },

      dialogs: {
        addOrganisation: false,
        editOrganisation: false,
        editOrganisationManagers: false,
      },

      loading: {
        table: false,
      },

      selectedItem: null,

      options: {
        page: 1,
        itemsPerPage: 10,
        sortBy: ['created_at'],
        sortDesc: [true],
        groupBy: [],
        groupDesc: [],
        multiSort: true,
        mustSort: true,
        initialLoad: true,
      },

      sortNameMap: {},

      filterObject: {
        is_featured: null,
        requires_signup: null,
        is_invitational: null,
      },

      footerOptions: {
        'items-per-page-options': [5, 10, 25, 50],
      },

      headers: [
        {
          text: 'Name',
          align: 'left',
          sortable: false,
          value: 'name',
        },
        {
          text: 'Website',
          align: 'left',
          sortable: false,
          value: 'website',
          width: '150px',
        },
        {
          text: 'Email',
          align: 'left',
          sortable: false,
          value: 'email',
          width: '150px',
        },
        {
          text: 'Actions',
          sortable: false,
          value: 'action',
          width: '90px',
        },
      ],

      generation: {
        organisations: 0,
      },
    }
  },

  computed: {},

  mounted() {
    //login required, else redirect to home
    if (!this.$store.getters['auth/user']) {
      this.$router.push('/')
    } else {
      this.$apollo.queries.organisations.skip = false
    }
  },

  methods: {
    isCurrentOrganisation(organisation) {
      return this.$store.getters['organisation/current']?.id === organisation.id
    },
    openDialog(dialogName) {
      if (dialogName in this.dialogs) {
        this.dialogs[dialogName] = true
      }
    },

    handleUpdateOptions(options) {
      if (options.initialLoad) {
        options.initialLoad = false
      } else {
        //this.reset();
      }
    },

    openEditOrganisationDialog(item) {
      this.selectedItem = item
      this.openDialog('editOrganisation')
    },

    openEditOrganisationManagersDialog(item) {
      this.selectedItem = item
      this.openDialog('editOrganisationManagers')
    },

    openAddOrganisationDialog() {
      //must be logged in
      if (!this.$store.getters['auth/user']) {
        this.$root.$emit('login-dialog', this.$route.fullPath)
        this.$notifier.showSnackbar({
          message: 'Login required',
          variant: 'error',
        })
      } else {
        this.openDialog('addOrganisation')
      }
    },

    addItem(item) {
      this.enterOrganisation(item)
      this.reset()
    },

    editItem(item) {
      //update the vuex store entry if that item was edited
      if (this.$store.getters['organisation/current']?.id === item.id) {
        this.enterOrganisation(item)
      }
    },

    enterOrganisation(organisation) {
      this.$store.commit('organisation/setCurrent', organisation)
      this.$notifier.showSnackbar({
        message: 'Current Organisation Has Been Set',
        variant: 'success',
      })
    },

    reset() {
      this.$apollo.queries.organisations.refresh()
    },
  },

  head() {
    return {
      title: 'My Organisations',
    }
  },

  apollo: {
    organisations: {
      query: ORGANISATIONS_QUERY,
      variables() {
        return {
          first: this.options.itemsPerPage,
          page: this.options.page,
        }
      },
      //pollInterval: 5 * 60 * 1000,
      manual: true,
      skip: true,
      result({ data }) {
        if (data) {
          this.organisations = data.organisations
        }
      },
    },
  },
}
</script>

<style scoped>
.pointer-cursor {
  cursor: pointer;
}

.selected-bg {
  background-color: green;
}
</style>
