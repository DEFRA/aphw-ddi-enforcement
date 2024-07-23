const { get } = require('./base')

const cdoEndpoint = 'cdo'

const options = {
  json: true
}

const getCdo = async (indexNumber) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, options)
  return payload.cdo
}

const getManageCdoDetails = async (indexNumber) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, options)
  return payload
}

const getCdoTaskDetails = async (indexNumber, taskName) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}/manage`, options)
  return payload
}

module.exports = {
  getCdo,
  getManageCdoDetails,
  getCdoTaskDetails
}
