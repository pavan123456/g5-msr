const axios = require('axios')

const {
  NOTE_SERVICE_USERNAME: username,
  NOTE_SERVICE_PASSWORD: password,
  NOTE_SERVICE_URL: noteServiceUrl,
  NOTE_SERVICE_TOKEN: token
} = process.env

module.exports = {
login,
getNotes,
getCases,
getWorkQ,
getCategories
}

/**
 *
 */
function login () {
  return axios.post(`${noteServiceUrl}/api/v1/login`, { username, password })
}

/**
 *
 * @param {String} clientUrn
 * @param {String} to
 * @param {String} from
 */
function getNotes(clientUrn, to = '2020-08-07', from = '2020-06-01') {
  return axios.get(`${noteServiceUrl}/api/v1/notes?access_token=${token}&clientUrn=${clientUrn}&searchBy=createdAt&to=${to}&from=${from}`)
}

/**
 *
 * @param {String} clientUrn
 * @param {String} to
 * @param {String} from
 */
function getCases(clientUrn, to = '2020-08-07', from = '2020-06-01') {
  return axios.get(`${noteServiceUrl}/api/v1/cases?access_token=${token}&clientUrn=${clientUrn}&searchBy=closedDate&to=${to}&from=${from}`)
}

/**
 *
 * @param {String} clientUrn
 * @param {String} to
 * @param {String} from
 */
function getWorkQ(clientUrn, to = '2020-08-07', from = '2020-06-01') {
  return axios.get(`${noteServiceUrl}/api/v1/dam/workq/${clientUrn}?access_token=${token}&searchBy=created_at&to=${to}&from=${from}`)
}

/**
 *
 */
function getCategories() {
  return axios.get(`${noteServiceUrl}/api/v1/categories?access_token=${token}`)
}
