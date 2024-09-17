const config = require('../../config')

const wreck = require('@hapi/wreck')
const { addHeaders } = require('../shared')

const baseUrl = config.ddiIndexApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

const callDelete = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }

  const { payload } = await wreck.delete(`${baseUrl}/${endpoint}`, options)

  return payload
}

module.exports = {
  get,
  callDelete
}
