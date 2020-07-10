<template>
  <v-dialog
    v-model="status"
    scrollable
    max-width="800px"
    @click:outside="close()"
  >
    <v-card>
      <v-card-title>
        <v-icon left>mdi-plus</v-icon>
        <span class="headline">New Organisation</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <v-container>
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
        <Button variant="text" @click="close()">Cancel</Button>
        <Button :loading="loading.addOrganisation" @click="submit()"
          >Submit</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { CREATE_ORGANISATION_MUTATION } from '~/gql/mutation/organisation.js'
import Button from '~/components/shared/button.vue'

export default {
  components: { Button },

  props: {
    status: {
      type: Boolean,
    },
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
        addOrganisation: false,
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

    async submit() {
      this.loading.addOrganisation = true
      try {
        if (!/\S/.test(this.inputs.name)) {
          throw sharedService.generateError('Non-empty name required')
        }

        let { data } = await this.$apollo.mutate({
          mutation: CREATE_ORGANISATION_MUTATION,
          variables: {
            name: this.inputs.name,
            website: this.inputs.website || undefined,
            logo: this.inputs.logo || undefined,
            email: this.inputs.email || undefined,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Organisation Added',
          variant: 'success',
        })

        this.$emit('submit', data.createOrganisation)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addOrganisation = false
    },

    reset() {
      this.inputs = {
        name: '',
        website: null,
        logo: null,
        email: null,
      }
    },
  },
}
</script>
