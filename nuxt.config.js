module.exports = {
  telemetry: false,
  ssr: false,
  server: {
    host: process.env.BASE_URL || '0.0.0.0',
    port: process.env.PORT || 5000
  },
  head: {
    title: 'Managed Services Report',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      {
        hid: 'description',
        name: 'description',
        content: process.env.npm_package_description || ''
      }
    ],
    link: [
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico'
      },
      { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Roboto:wght@400;700&family=Roboto+Condensed:wght@400;700&display=swap' }
    ]
  },
  loading: {
    color: '#7898ad',
    failedColor: '#ff0033',
    continuous: true,
    throttle: 300,
    duration: 2000,
    height: '4px'
  },
  loadingIndicator: '@/static/loading.html',
  css: [
    '@/assets/theme.scss',
    '@/assets/hamburger.scss',
    '@/assets/transitions.scss'
  ],
  plugins: [
    { src: '@/plugins/apex-charts', mode: 'client' },
    { src: '@/plugins/vue-multiselect', mode: 'client' }
  ],
  components: true,
  modules: [
    'bootstrap-vue/nuxt',
    '@nuxtjs/axios'
  ],
  bootstrapVue: {
    bootstrapCSS: false,
    bootstrapVueCSS: false,
    icons: true
  },
  googleAnalytics: {
    id: process.env.GA_PROPERTY,
    debug: {
      enabled: false,
      sendHitTask: true
    }
  },
  axios: {
    browserBaseURL: `//${process.env.BROWSER_URL}`
  },
  build: {
    extend (config, ctx) {
      if (ctx.isDev) {
        config.devtool = ctx.isClient
          ? 'source-map'
          : 'inline-source-map'
      }
    }
  }
}
