require('dotenv').config()
const express = require('express')
const consola = require('consola')
const { Nuxt, Builder } = require('nuxt')
const g5Auth = require('@getg5/g5-auth')

const authConfig = {
  passport: {
    domain: process.env.AUTH0_DOMAIN,
    clientID: process.env.AUTH0_CLIENT_ID,
    clientSecret: process.env.AUTH0_CLIENT_SECRET,
    callbackURL: process.env.AUTH0_CALLBACK_URL || 'http://localhost:3000/users/auth/auth0/callback'
  },
  session: {
    secret: 'CHANGE THIS TO A RANDOM SECRET',
    cookie: {},
    resave: false,
    saveUninitialized: true
  },
  defaultRedirectPath: '/',
  authenticate: {
    scope: 'openid email profile',
    audience: `https://${process.env.AUTH0_DOMAIN}/userinfo`
  }
}

const regexWhitelist = [
  /\/report$/,
  /\/api\/v1\/reports\/display\/\S*$/,
  /\/api\/v1\/reports\/\S*$/,
  /\/[0-9a-z-]*\.png/,
  /\/[0-9a-z-]*\.ico/,
  /\/[~./0-9a-z-]*\.js/
]

const config = require('../nuxt.config.js')
const app = express()
const queue = require('./controllers/queue')
queue.init(app)
g5Auth.init(app, authConfig)
const models = require('./models')
config.dev = process.env.NODE_ENV !== 'production'

function dynamicWhitelist (path) {
  return regexWhitelist.some(url => url.test(path))
}

function checkWhiteList (req, res, next) {
  if (dynamicWhitelist(req.path)) {
    next()
  } else {
    g5Auth.secured(req, res, next)
  }
}

app.use(checkWhiteList)

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
