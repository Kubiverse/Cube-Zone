<template>
  <v-container fluid fill-height>
    <v-layout align-center justify-center>
      <v-flex xs12 sm8 md4>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark flat>
            <v-toolbar-title>User Settings</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn text @click="goToWcaAuth()">
              <img
                src="../static/WCAlogo_notext.svg"
                alt=""
                style="width: 32px;"
                class="pr-2"
              />
              Link WCA Account
            </v-btn>
          </v-toolbar>
          <v-card-text>
            <v-text-field
              v-model="inputs.first_name"
              label="First Name"
              name="firstname"
              prepend-icon="mdi-account-details"
              type="text"
            ></v-text-field>
            <v-text-field
              v-model="inputs.last_name"
              label="Last Name"
              name="lastname"
              prepend-icon="mdi-account-details"
              type="text"
            ></v-text-field>
            <!--
            <v-text-field
              label="Display Name"
              v-model="inputs.display_name"
              name="display_name"
              prepend-icon="mdi-account-details"
              type="text"
            ></v-text-field>
            -->
            <v-text-field
              v-model="inputs.wca_id"
              label="WCA ID (Must be Linked)"
              name="wca_id"
              prepend-icon="mdi-account-details"
              type="text"
              readonly
            ></v-text-field>
            <v-autocomplete
              v-model="inputs.nationality"
              :items="countries"
              :filter="customFilter"
              prepend-icon="mdi-flag"
              item-text="name"
              item-value="id"
              label="Nationality"
            ></v-autocomplete>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              color="primary"
              :loading="loading.submitting"
              @click="handleSubmit()"
              >Save Changes</v-btn
            >
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { ME_QUERY } from '~/gql/query/cuber.js'
import { UPDATE_CUBER_MUTATION } from '~/gql/mutation/cuber.js'
import sharedService from '~/services/shared.js'
import { countriesArray } from '~/services/constants.js'
import authService from '~/services/auth.js'

export default {
  components: {},

  data() {
    return {
      inputs: {
        id: null,
        first_name: null,
        last_name: null,
        //display_name: null,
        nationality: null,
      },

      countries: countriesArray,

      loading: {
        submitting: false,
        loadCuber: false,
      },
    }
  },

  mounted() {
    if (!this.$store.getters['auth/user']) {
      this.$router.push('/login')
    }
    this.reset()
  },

  methods: {
    goToWcaAuth() {
      authService.goToWcaAuth(this.$route.fullPath)
    },

    customFilter(item, queryText, _itemText) {
      const textOne = item.name.toLowerCase()
      const textTwo = item.id.toLowerCase()
      const searchText = queryText.toLowerCase()

      return (
        textOne.indexOf(searchText) > -1 || textTwo.indexOf(searchText) > -1
      )
    },

    async handleSubmit() {
      this.loading.submitting = true
      try {
        let { data } = await this.$apollo.mutate({
          mutation: UPDATE_CUBER_MUTATION,
          variables: this.inputs,
        })

        this.$store.commit('auth/setUserInit', {
          user: data.updateCuber,
        })

        sharedService.generateSnackbar(
          this.$root,
          'User info updated successfully',
          'success',
        )
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.submitting = false
    },

    async loadData() {
      this.loading.loadCuber = true
      try {
        let { data } = await this.$apollo.query({
          query: ME_QUERY,
        })

        this.inputs = {
          id: data.me.id,
          first_name: data.me.first_name,
          last_name: data.me.last_name,
          //display_name: data.me.display_name,
          nationality: data.me.nationality,
          wca_id: data.me.wca_id,
        }
      } catch (err) {
        sharedService.handleError(err, this.$root)
      }
      this.loading.loadCuber = false
    },

    reset() {
      this.loadData()
    },
  },

  head() {
    return {
      title: 'Settings',
    }
  },
}
</script>
