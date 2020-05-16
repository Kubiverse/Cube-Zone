import { ME_QUERY } from '~/gql/query/cuber.js'

export default (context) => {
  const { store } = context;
  
  return new Promise((resolve, reject) => {
    if(store.$apolloHelpers.getToken() && !store.getters["auth/user"]) {

      //fetch the user info
      context.app.apolloProvider.defaultClient.query({
        query: ME_QUERY
      }).then(data => {
        if(!data.data.me) {
          return resolve();
        }

        store.commit("auth/setUserInit", {
          user: data.data.me
        });
        resolve();
      }).catch(err => {
        resolve();
      });
    } else {
      resolve();
    }
  });
};
