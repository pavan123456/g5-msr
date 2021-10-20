const {
  AUTH0_CLIENT_ID: client_id,
  AUTH0_CLIENT_SECRET: client_secret,
  AUTH0_DOMAIN: auth0_domain
} = process.env

const axios = require('axios')
class Auth0M2M {
  constructor (params) {
    if (Auth0M2M._instance) {
      throw new Error('Auth0M2M already has an instance!!!')
    }
    this.client_id = params.client_id
    this.client_secret = params.client_secret
    this.auth0_domain = params.auth0_domain
    this.tokens = {}
    this.allowedTypes = ['get', 'post', 'put', 'delete']
    this.safteyNet = 3600
    Auth0M2M._instance = this
  }

  isExpired (audience) {
    if (this.tokens[audience]) {
      const expireSafteyNet = this.tokens[audience].expiresIn - this.safteyNet
      const now = Date.now()
      const expirationDate = new Date(this.tokens[audience].createdAt + expireSafteyNet)
      return (now > expirationDate)
    } else {
      return true
    }
  }

  async fetchToken (audience) {
    const data = {
      client_id: this.client_id,
      grant_type: 'client_credentials',
      client_secret: this.client_secret,
      audience
    }
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    }
    const res = await axios.post(`https://${this.auth0_domain}/oauth/token`, data, config)
    const createdAt = new Date()
    const { access_token, expires_in, token_type } = res.data
    this.tokens[audience] = { access_token, expires_in, token_type, createdAt }
  }

  async request (url, method, data, audience) {
    if (!this.allowedTypes.includes(method)) {
      throw new Error('The supplied requestType is not allowed')
    }
    if (this.isExpired(audience)) {
      await this.fetchToken(audience)
    }

    const config = {
      method,
      url,
      headers: {
        Authorization: `Bearer ${this.tokens[audience].access_token}`,
        'Content-Type': 'application/json'
      }
    }
    if (data) {
      config.data = data
    }
    try {
      const res = await axios(url, config)
      return res
    } catch (error) {
      if (error.response.status === 401) {
        await this.refresh(audience)
        return axios(url, config)
      } else if (error.response && error.response.data && error.response.data.errors) {
        throw new Error(this.formatErrors(error.response.data.errors))
      } else {
        throw new Error(error)
      }
    }
  }

  formatErrors (errors) {
    return Object.keys(errors).reduce((acc, cur) => (acc === '' ? `${acc}${errors[cur]}` : `${acc}, ${errors[cur]}`), '')
  }
}

module.exports = new Auth0M2M({ client_id, client_secret, auth0_domain })
