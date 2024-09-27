const config = require('../../config')

const wreck = require('@hapi/wreck')
const { addHeaders } = require('../shared')

const baseUrl = config.ddiIndexApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, options)

  return payload
}

const put = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.put(`${baseUrl}/${endpoint}`, options)

  return JSON.parse(payload)
}

const callDelete = async (endpoint, user) => {
  const options = user?.username ? { json: true, headers: addHeaders(user) } : { json: true }

  const { payload } = await wreck.delete(`${baseUrl}/${endpoint}`, options)

  return payload
}

const buildPostRequest = (baseUrl) => async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const { payload } = await wreck.post(`${baseUrl}/${endpoint}`, options)

  if (!payload.toString().length > 0) {
    return
  }

  return JSON.parse(payload)
}

const post = buildPostRequest(baseUrl)

module.exports = {
  get,
  put,
  post,
  callDelete
}
