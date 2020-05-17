import colors from 'vuetify/es5/util/colors'

export default {
  env: {
    DEV: process.env.DEV,
    build_date: new Date().toDateString(),
  },

  mode: 'universal',
  /*
   ** Headers of the page
   */
  head: {
    titleTemplate: 'Cube.Zone - %s',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || '',
      },
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css?family=Share+Tech+Mono',
      },
    ],
  },
  /*
   ** Customize the progress-bar color
   */
  loading: { color: '#fff' },
  /*
   ** Global CSS
   */
  css: ['@/assets/css/cubing-icons.css'],
  /*
   ** Plugins to load before mounting the App
   */
  plugins: ['@/plugins/misc', '@/plugins/apolloAuth', '@/plugins/vuetify'],
  /*
   ** Nuxt.js dev-modules
   */
  buildModules: ['@nuxtjs/vuetify', '@nuxtjs/dotenv'],
  /*
   ** Nuxt.js modules
   */
  modules: ['@nuxtjs/apollo', 'nuxt-clipboard2'],

  // Give apollo module options
  apollo: {
    tokenName: 'apollo-token', // optional, default: apollo-token
    cookieAttributes: {
      /**
       * Define when the cookie will be removed. Value can be a Number
       * which will be interpreted as days from time of creation or a
       * Date instance. If omitted, the cookie becomes a session cookie.
       */
      expires: 30, // optional, default: 7 (days)

      /**
       * Define the path where the cookie is available. Defaults to '/'
       */
      path: '/', // optional

      /**
       * A Boolean indicating if the cookie transmission requires a
       * secure protocol (https). Defaults to false.
       */
      secure: false,
    },
    includeNodeModules: true, // optional, default: false (this includes graphql-tag for node_modules folder)
    // (Optional) Default 'apollo' definition
    defaultOptions: {
      // See 'apollo' definition
      // For example: default query options
      $query: {
        loadingKey: 'loading',
        fetchPolicy: 'cache-and-network',
      },
    },
    // required
    clientConfigs: {
      default: '~/plugins/apolloConfig.js',
    },
  },

  /*
   ** vuetify module configuration
   ** https://github.com/nuxt-community/vuetify-module
   */
  vuetify: {
    customVariables: ['~/assets/variables.scss'],
    theme: {
      dark: true,
      themes: {
        dark: {
          primary: colors.blue.darken2,
          accent: colors.grey.darken3,
          secondary: colors.amber.darken3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
        light: {
          primary: colors.blue.lighten2,
          accent: colors.grey.lighten3,
          secondary: colors.amber.lighten3,
          info: colors.teal.lighten1,
          warning: colors.amber.base,
          error: colors.deepOrange.accent4,
          success: colors.green.accent3,
        },
      },
    },
  },
  /*
   ** Build configuration
   */
  build: {
    /*
     ** You can extend webpack config here
     */
    // eslint-disable-next-line no-unused-vars
    extend(config, ctx) {},
  },
}
