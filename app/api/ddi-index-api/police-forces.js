const { get } = require('./base')

const policeForcesEndpoint = 'police-forces'

/**
 * @typedef PoliceForceRequest
 * @property {string} name
 */

const getPoliceForces = async (user) => {
  const payload = await get(policeForcesEndpoint, user)

  return payload.policeForces
}

module.exports = {
  getPoliceForces
}
