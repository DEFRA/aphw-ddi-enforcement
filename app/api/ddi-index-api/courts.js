const { get } = require('./base')

const courtsEndpoint = 'courts'

/**
 * @typedef Court
 * @return {{
 *   id: number;
 *   name: string;
 * }}
 */

/**
 * @return {Promise<Court[]>}
 */
const getCourts = async (user) => {
  const payload = await get(courtsEndpoint, user)

  return payload.courts
}

/**
 * @typedef CourtRequest
 * @property {string} name
 */

module.exports = {
  getCourts
}
