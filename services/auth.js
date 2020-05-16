const Cookie = require('js-cookie');
import sharedService from '~/services/shared.js';
import randomstring from "randomstring";

export default {
  goToWcaAuth(redirectRoute = null) {
    if(process.client) {
      const stateNonce = randomstring.generate(12);
      Cookie.set("states", {
        [stateNonce]: {
          redirectRoute: redirectRoute
        }
      });

      window.location = process.env.WCA_AUTH_URL + "&state=" + stateNonce;
    }
  },

  validateState(nonce) {
    if(!nonce) throw sharedService.generateError("Invalid nonce.");

    if(!Cookie.get("states")) return {};

    const states = JSON.parse(Cookie.get("states"));

    if(!(nonce in states)) throw sharedService.generateError("Invalid nonce.");

    return states[nonce];    
  },

  async handleLogin(that, authPayload) {
    await that.$apolloHelpers.onLogin(authPayload.access_token);

    //put the response in the vuex store
    that.$store.commit("auth/setUserInit", authPayload);
  },

  async handleLogout(that) {
    await that.$apolloHelpers.onLogout();
    that.$store.commit("auth/unsetUser");
    //Cookie.remove('apollo-token');
  }
};
