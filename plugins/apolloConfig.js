import generatePusherLink from "~/services/pusherLink.js";

export default (context) => {
  const { apolloLink, pusher } = generatePusherLink(context);

  context.app.pusher = pusher;
  return {
    // required  
    httpEndpoint: process.env.API_URL + '/graphql',
    
    link: apolloLink,
    connectToDevTools: true,
    defaultHttpLink: false,
    // optional
    // See https://www.apollographql.com/docs/link/links/http.html#options
    httpLinkOptions: {
      credentials: 'same-origin'
    },
    // You can use `wss` for secure connection (recommended in production)
    // Use `null` to disable subscriptions
    wsEndpoint: null, // optional
    // LocalStorage token
    tokenName: 'apollo-token', // optional
    // Enable Automatic Query persisting with Apollo Engine
    persisting: false, // Optional
    // Use websockets for everything (no HTTP)
    // You need to pass a `wsEndpoint` for this to work
    websocketsOnly: false // Optional
  };
    /*
    test: {
      httpEndpoint: 'http://localhost:5000',
      wsEndpoint: 'ws://localhost:5000',
      tokenName: 'apollo-token'
    },
    // alternative: user path to config which returns exact same config options
    test2: '~/plugins/my-alternative-apollo-config.js'
    */
}