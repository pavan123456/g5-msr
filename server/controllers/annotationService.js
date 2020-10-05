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
/**
 * Login and set the api token
 *
 * @returns
 * @memberof AnnotationService
 */
login () {
    return axios.post(`${noteServiceUrl}/api/v1/login`, { username, password })
      .then(({ data }) => {
        this.apiToken = data.token
        this.tokenIssueDate = Date.now()
      })
  }
  /**
   * Get all notes for a period and client urn
   *
   * @param {*} clientUrn
   * @param {string} [to='2020-08-07']
   * @param {string} [from='2020-06-01']
   * @returns
   * @memberof AnnotationService
   */
  async getNotes (clientUrn, to = '2020-08-07', from = '2020-06-01') {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/notes?access_token=${this.apiToken}&clientUrn=${clientUrn}&searchBy=createdAt&to=${to}&from=${from}`)
  }
/**
 * Get all cases for a period and client urn
 *
 * @param {*} clientUrn
 * @param {string} [to='2020-08-07']
 * @param {string} [from='2020-06-01']
 * @returns
 * @memberof AnnotationService
 */
async getCases(clientUrn, to = '2020-08-07', from = '2020-06-01') {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/cases?access_token=${this.apiToken}&clientUrn=${clientUrn}&searchBy=closedDate&to=${to}&from=${from}`)
  }
/**
 * Get all workQ items for a period and client urn
 *
 * @param {*} clientUrn
 * @param {string} [to='2020-08-07']
 * @param {string} [from='2020-06-01']
 * @returns
 * @memberof AnnotationService
 */
async getWorkQ(clientUrn, to = '2020-08-07', from = '2020-06-01') {
    await this.checkTokenAge()
    return axios.get(`${noteServiceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${this.apiToken}&searchBy=created_at&to=${to}&from=${from}`)
  }
/**
 *
 *
 * @returns
 * @memberof AnnotationService
 */
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
  updateNote(id, update) {
    return axios.put(`${noteServiceUrl}/api/v1/note/${id}?access_token=${this.apiToken}`, update)
  }
}
 
module.exports =  new AnnotationService()
