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
        <span class="headline">Edit Competition</span>
      </v-card-title>

      <v-card-text style="max-height: 600px;">
        <div
          v-if="$apollo.queries.competition.loading"
          class="text-center"
          style="width: 100%;"
        >
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
                    prepend-icon="event"
                    readonly
                    v-bind="attrs"
                    v-on="on"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="date"
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
                    prepend-icon="event"
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
        <v-btn color="blue darken-1" text @click="close()">Cancel</v-btn>
        <v-btn
          color="primary"
          :loading="loading.editCompetition"
          @click="submit()"
          >Submit</v-btn
        >
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
import sharedService from '~/services/shared.js'
import { UPDATE_COMPETITION_MUTATION } from '~/gql/mutation/competition.js'
import { COMPETITION_BASIC_QUERY } from '~/gql/query/competition.js'

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
        editCompetition: false,
      },
      competition: null,
    }
  },

  apollo: {
    competition: {
      query: COMPETITION_BASIC_QUERY,
      variables() {
        return {
          id: this.selectedItem.id,
        }
      },

      result({ data }) {
        //load data into inputs
        if (data) {
          this.inputs = {
            name: data.competition.name,
            description: data.competition.description,
            time_limit: data.competition.time_limit / 1000,
            time_target: data.competition.time_target / 1000,
            max_capacity: data.competition.max_capacity,
          }
        }
      },

      fetchPolicy: 'no-cache',

      manual: true,
      skip: true,
    },
  },

  computed: {
    id() {
      return this.selectedItem ? this.selectedItem.id : null
    },
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
      this.loading.editCompetition = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_COMPETITION_MUTATION,
          variables: {
            id: this.selectedItem.id,
            name: this.inputs.name,
            description: this.inputs.description,
            start_date: this.inputs.start_date,
            end_date: this.inputs.end_date || undefined,
            is_featured: this.inputs.is_featured,
            requires_signup: this.inputs.requires_signup,
            is_invitational: this.inputs.is_invitational,
          },
        })

        this.$notifier.showSnackbar({
          message: 'Competition Updated',
          variant: 'success',
        })

        this.$emit('submit', data)

        this.close()
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.editCompetition = false
    },

    reset() {
      this.$apollo.queries.competition.skip = false
    },
  },
}
</script>
