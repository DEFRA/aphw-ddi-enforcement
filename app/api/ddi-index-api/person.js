const { get } = require('./base')

const personEndpoint = 'person'

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

const getPersonAndDogs = async (personReference, user) => {
  const payload = await get(`${personEndpoint}/${personReference}?includeDogs=true`, user)
  return payload
}

/**
 * @param reference
 * @param user
 * @return {Promise<Person>}
 */
const getPersonByReference = async (reference, user) => {
  return get(`${personEndpoint}/${reference}`, user)
}

module.exports = {
  getPersonAndDogs,
  getPersonByReference
}
