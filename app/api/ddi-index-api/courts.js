const { get } = require('./base')

const courtsEndpoint = 'courts'

const options = {
  json: true
}

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
const getCourts = async () => {
  const payload = await get(courtsEndpoint, options)

  return payload.courts
}

/**
 * @typedef CourtRequest
 * @property {string} name
 */

module.exports = {
  getCourts
}
