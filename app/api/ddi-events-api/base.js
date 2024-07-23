const config = require('../../config')

const wreck = require('@hapi/wreck')
const { buildPostRequest, addHeaders } = require('../shared')
const { ApiErrorFailure } = require('../../errors/api-error-failure')

const baseUrl = config.ddiEventsApi.baseUrl

const get = async (endpoint, user) => {
  const options = user?.username
    ? { headers: addHeaders(user) }
    : {}

  const { payload } = await wreck.get(`${baseUrl}/${endpoint}`, { ...options, json: true })

  return payload
}

const postTemp = buildPostRequest(baseUrl)

const postWithBoomTemp = async (endpoint, data, user) => {
  const options = user?.username
    ? { payload: data, headers: addHeaders(user) }
    : { payload: data }

  const uri = `${baseUrl}/${endpoint}`

  const res = await wreck.request('POST', uri, options)

  const body = await wreck.read(res)

  const responseData = {
    payload: JSON.parse(body.toString()),
    statusCode: res.statusCode,
    statusMessage: res.statusMessage
  }

  if (!res.statusCode.toString().startsWith('2')) {
    throw new ApiErrorFailure(`${res.statusCode} ${res.statusMessage}`, responseData)
  }

  return responseData
}

module.exports = {
  get,
  postTemp,
  postWithBoomTemp
}
