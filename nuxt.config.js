module.exports = {
  telemetry: false,
  mode: 'spa',
  server: {
    host: process.env.BASE_URL || '0.0.0.0',
    port: process.env.PORT || 5000
  },
  serverMiddleware: [],
  head: {
    title: 'Managed Services Report',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Fira+Sans:wght@400;700&display=swap' }
    ]
  },
  loading: '@/components/loading.vue',
  // loading: {
  //   color: '#7898ad',
  //   failedColor: '#ff0033',
  //   continuous: true,
  //   throttle: 300,
  //   duration: 2000,
  //   height: '4px'
  // },
  loadingIndicator: '@/static/loading.html',
  css: [
    '@/assets/theme.scss',
    '@/assets/transitions.scss'
  ],
  // TODO could this be set to a function that returns an array of paths to each file in the plugins directory?
  plugins: [
    '@/plugins/apex-charts'
  ],
  buildModules: [
    '@nuxtjs/eslint-module'
  ],
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: true
  },
  axios: {
    debug: true,
    browserBaseURL: `//${process.env.BROWSER_URL}`
  },
  googleAnalytics: {
    id: process.env.GA_PROPERTY,
    debug: {
      enabled: true,
      sendHitTask: true
    }
  },
  build: {
    extend (config, ctx) {
      // show correct line numbers in browser console
      if (ctx.isDev) {
        config.devtool = ctx.isClient
          ? 'source-map'
          : 'inline-source-map'
      }
    }
  }
}
