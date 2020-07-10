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
        <span class="headline">New Competition</span>
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
            <v-col cols="12" sm="12" class="py-0">
              <v-textarea
                v-model="inputs.description"
                label="Description"
                filled
                dense
                class="py-0"
              ></v-textarea>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-menu
                v-model="menu.start_date"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inputs.start_date"
                    label="Start Date"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="inputs.start_date"
                  @input="menu.start_date = false"
                ></v-date-picker>
              </v-menu>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-menu
                v-model="menu.end_date"
                :close-on-content-click="false"
                :nudge-right="40"
                transition="scale-transition"
                offset-y
                min-width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="inputs.end_date"
                    label="End Date (optional)"
                    prepend-icon="mdi-calendar"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="menu.end_date"
                  @input="menu.end_date = false"
                ></v-date-picker>
              </v-menu>
            </v-col>

            <v-col cols="4" class="py-0">
              <v-switch
                v-model="inputs.is_featured"
                label="Is Featured"
              ></v-switch>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-switch
                v-model="inputs.requires_signup"
                label="Signup Required"
              ></v-switch>
            </v-col>
            <v-col cols="4" class="py-0">
              <v-switch
                v-model="inputs.is_invitational"
                label="Is Invitational"
              ></v-switch>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <Button variant="text" @click="close()">Cancel</Button>
        <Button :loading="loading.addCompetition" @click="submit()"
          >Submit</Button
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { CREATE_COMPETITION_MUTATION } from '~/gql/mutation/competition.js'
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
        description: '',
        start_date: null,
        end_date: null,
        is_featured: false,
        requires_signup: false,
        is_invitational: false,
      },

      menu: {
        start_date: false,
        end_date: false,
      },

      loading: {
        addCompetition: false,
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
      this.loading.addCompetition = true
      try {
        if (!this.inputs.start_date) {
          throw sharedService.generateError('Start Date Required')
        }

        if (!/\S/.test(this.inputs.name)) {
          throw sharedService.generateError('Non-empty name required')
        }

        if (!this.$store.getters['organisation/current']) {
          throw sharedService.generateError(
            'Organisation required to create a competition',
          )
        }

        let { data } = await this.$apollo.mutate({
          mutation: CREATE_COMPETITION_MUTATION,
          variables: {
            name: this.inputs.name,
            description: this.inputs.description || '',
            start_date: this.inputs.start_date,
            end_date: this.inputs.end_date || undefined,
            is_featured: this.inputs.is_featured,
            requires_signup: this.inputs.requires_signup,
            is_invitational: this.inputs.is_invitational,
            organisation_id: this.$store.getters['organisation/current'].id,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Competition Added',
          variant: 'success',
        })

        this.$emit('submit', data.createCompetition)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.addCompetition = false
    },

    reset() {
      this.inputs = {
        name: '',
        description: '',
        start_date: null,
        end_date: null,
        is_featured: false,
        requires_signup: false,
        is_invitational: false,
      }
    },
  },
}
</script>
