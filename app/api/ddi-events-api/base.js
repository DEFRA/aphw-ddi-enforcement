const config = require('../../config')

const wreck = require('@hapi/wreck')
const { addHeaders } = require('../shared')

const baseUrl = config.ddiEventsApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username
    ? { headers: addHeaders(user) }
    : {}

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, { ...options, json: true })

  return payload
}

module.exports = {
  get
}
