<template>
  <v-container
    fluid
    fill-height
  >
    <v-layout
      align-center
      justify-center
    >
      <div v-if="errorMessage">
        <span class="display-1 pl-2">{{ errorMessage }}
        </span>
      </div>
      <div v-else-if="loading.verifying">
        <span class="display-1 pl-2">Verifying WCA Code...
          <v-progress-circular indeterminate></v-progress-circular>
        </span>
      </div>
    </v-layout>
  </v-container>
</template>

<script>
import { SOCIAL_LOGIN_MUTATION } from '~/gql/mutation/auth.js'
import sharedService from '~/services/shared.js';
import authService from '~/services/auth.js';

export default {
  components: {},

  head() {
    return {
      title: "Verify WCA Authorization"
    }
  },

  data() {
    return {
      loading: {
        verifying: false,
      },

      errorMessage: null
    };
  },

  mounted() {
    this.attemptWcaAuthorization();
  },

  methods: {
    async attemptWcaAuthorization() {
      this.loading.verifying = true;
      try {
        if(!this.$route.query.code) {
          throw sharedService.generateError("Missing authorization code, please try again.");
        }

        const state = authService.validateState(this.$route.query.state);

        let { data } = await this.$apollo.mutate({
          mutation: SOCIAL_LOGIN_MUTATION,
          variables: {
            provider: "wca",
            token: this.$route.query.code
          }
        });

        await authService.handleLogin(this, data.socialLogin);

        this.$router.push(state.redirectRoute || "/");
      } catch(err) {
        sharedService.handleError(err, this.$root);
        this.errorMessage = sharedService.sanitizeErrorMessage(err.message);
      }
      this.loading.verifying = false;
    },
  },
}
</script>
