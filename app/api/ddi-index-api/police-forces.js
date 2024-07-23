const { get } = require('./base')

const policeForcesEndpoint = 'police-forces'

const options = {
  json: true
}

/**
 * @typedef PoliceForceRequest
 * @property {string} name
 */

const getPoliceForces = async () => {
  const payload = await get(policeForcesEndpoint, options)

  return payload.policeForces
}

module.exports = {
  getPoliceForces
}
