const { get } = require('./base')

const personEndpoint = 'person'

const options = {
  json: true
}

/**
 * @typedef Address
 * @property {string} addressLine1
 * @property {string} addressLine2
 * @property {string} town
 * @property {string} postcode
 * @property {string} country
 */
/**
 * @typedef LatestContact
 * @property {string} email
 * @property {string} primaryTelephone
 * @property {string} secondaryTelephone
 */
/**
 * @typedef ContactList
 * @property {string[]} emails
 * @property {string[]} primaryTelephones
 * @property {string[]} secondaryTelephones
 */
/**
 * @typedef Contacts
 * @type {LatestContact|ContactList}
 */

/**
 * @typedef Person
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 * @property {string} personReference
 * @property {Address} address
 * @property {Contacts} contacts
 */

const getPersonAndDogs = async (personReference) => {
  const payload = await get(`${personEndpoint}/${personReference}?includeDogs=true`, options)
  return payload
}

/**
 * @param reference
 * @return {Promise<Person>}
 */
const getPersonByReference = async (reference) => {
  const res = await get(`${personEndpoint}/${reference}`)

  return res
}

module.exports = {
  getPersonAndDogs,
  getPersonByReference
}
