<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-pencil</v-icon>
        <span class="headline">Edit Organisation</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <div v-if="loading.loadData" class="text-center" style="width: 100%;">
          <v-progress-circular indeterminate></v-progress-circular>
        </div>
        <v-container v-else>
          <v-row>
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field
                v-model="inputs.name"
                label="Name"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field
                v-model="inputs.website"
                label="Website"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field
                v-model="inputs.logo"
                label="Logo URL"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
            <v-col cols="12" xs="12" class="py-0">
              <v-text-field
                v-model="inputs.email"
                label="Primary Contact Email"
                filled
                dense
                class="py-0"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          color="primary"
          :loading="loading.editOrganisation"
          @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { UPDATE_ORGANISATION_MUTATION } from '~/gql/mutation/organisation.js'
import { ORGANISATION_BASIC_QUERY } from '~/gql/query/organisation.js'

export default {
  props: {
    status: {
      type: Boolean,
    },

    selectedItem: {},
  },
  data() {
    return {
      inputs: {
        name: '',
        website: null,
        logo: null,
        email: null,
      },

      loading: {
        editOrganisation: false,
        loadData: false,
      },
    }
  },

  computed: {},

  watch: {
    status(_val) {
      this.reset()
    },
  },

  methods: {
    close() {
      this.$emit('close')
    },

    async submit() {
      this.loading.editOrganisation = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_ORGANISATION_MUTATION,
          variables: {
            id: this.selectedItem.id,
            name: this.inputs.name,
            website: this.inputs.website,
            logo: this.inputs.logo,
            email: this.inputs.email,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Organisation Updated',
          variant: 'success',
        })

        this.$emit('submit', data.updateOrganisation)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.editOrganisation = false
    },

    async loadData() {
      this.loading.loadData = true
      try {
        let { data } = await this.$apollo.query({
          query: ORGANISATION_BASIC_QUERY,
          variables: {
            id: this.selectedItem.id,
          },
          fetchPolicy: 'no-cache',
        })

        this.inputs = {
          name: data.organisation.name,
          website: data.organisation.website,
          logo: data.organisation.logo,
          email: data.organisation.email,
        }
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
