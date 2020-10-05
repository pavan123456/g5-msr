require('dotenv').config()
const {
  G5_AUTH_ENDPOINT: authorizationURL,
  G5_TOKEN_ENDPOINT: tokenURL,
  G5_AUTH_CLIENT_ID: clientID,
  G5_AUTH_CLIENT_SECRET: clientSecret,
  G5_AUTH_REDIRECT_URI: callbackURL,
  G5_AUTH_ME_ENDPOINT: authMeEndpoint,
  SESSION_SECRET: secret
} = process.env
const authConfig = {
  passport: {
    authorizationURL,
    tokenURL,
    clientID,
    clientSecret,
    callbackURL
  },
  authMeEndpoint,
  session: {
    secret
  },
  sucessRedirectPath: '/'
}
const regexWhitelist = [
  /\/report\/\S*$/,
  /\/api\/v1\/report\/\S*\?edit=false$/,
  /\/[0-9a-z-]*\.png/,
  /\/[~\./0-9a-z-]*\.js/
]
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
// const g5Auth = require('@getg5/g5-auth')
const config = require('../nuxt.config.js')
const queue = require('./controllers/queue')
const app = express()
queue.init(app)
// g5Auth.init(app, authConfig)
const models = require('./models')
config.dev = process.env.NODE_ENV !== 'production'
function dynamicWhitelist(path) {
  return regexWhitelist.some(url => url.test(path))
}
function checkWhiteList(req, res, next) {
  if (dynamicWhitelist(req.path)) {
    next()
  } else {
    g5Auth.isAuthenticated(req, res, next)
  }
}
// app.use(checkWhiteList)
require('./routes')(app)
const notesService = require('./controllers/annotationService')
async function start () {
  const nuxt = new Nuxt(config)

  const { host, port } = nuxt.options.server

  await nuxt.ready()
  if (config.dev) {
    const builder = new Builder(nuxt)
    await builder.build()
  }

  app.use(nuxt.render)

  models.sequelize
    .sync()
    .then(() => {
      console.log('models')
      try {
        notesService.login()
      } catch (error) {
        throw new Error('Could not login to the Notes Service')
      }
      app.listen(port, host)
      consola.ready({
        message: `Server listening on http://${host}:${port}`,
        badge: true
      })
    })
    .catch(err => console.log(err))
}
start()
