const axios = require('axios')
const {
  NOTE_SERVICE_USERNAME: username,
  NOTE_SERVICE_PASSWORD: password,
  NOTE_SERVICE_URL: noteServiceUrl,
} = process.env

class AnnotationService {
  constructor () {
    this.apiToken = null,
    this.tokenIssueDate = null
  }

  login () {
    return axios.post(`${noteServiceUrl}/api/v1/login`, { username, password })
      .then(({ data }) => {
        this.apiToken = data.token
        this.tokenIssueDate = Date.now()
      })
  }
  
  async getNotes (clientUrn, to = '2020-08-07', from = '2020-06-01') {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/notes?access_token=${this.apiToken}&clientUrn=${clientUrn}&searchBy=createdAt&to=${to}&from=${from}`)
  }

  async getCases(clientUrn, to = '2020-08-07', from = '2020-06-01') {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/cases?access_token=${this.apiToken}&clientUrn=${clientUrn}&searchBy=closedDate&to=${to}&from=${from}`)
  }

  async getWorkQ(clientUrn, to = '2020-08-07', from = '2020-06-01') {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${this.apiToken}&searchBy=created_at&to=${to}&from=${from}`)
  }

  async getCategories() {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/categories?access_token=${this.apiToken}`)
  }

  checkTokenAge() {
    const now = Date.now()
    const diff = (now - this.tokenIssueDate) / 3600000
    if (diff >= 23) {
      return this.login()
    }
  }
}
 
module.exports =  new AnnotationService()
