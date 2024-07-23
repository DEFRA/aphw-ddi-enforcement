const { get } = require('./base')

const dogEndpoint = 'dog'

const options = {
  json: true
}

const getDogDetails = async (indexNumber) => {
  const payload = await get(`${dogEndpoint}/${indexNumber}`, options)
  return payload.dog
}

const getDogOwner = async (indexNumber) => {
  const payload = await get(`dog-owner/${indexNumber}`, options)
  return payload.owner
}

/**
 * @typedef AddressDto
 * @property {string} country
 * @property {string} town
 * @property {string} postcode
 * @property {string} addressLine1
 * @property {string} addressLine2
 */
/**
 * @typedef DogDto
 * @property {number} id
 * @property {string} indexNumber
 * @property {string} dogReference
 * @property {string} microchipNumber
 * @property {string} microchipNumber2
 * @property {string} breed
 * @property {string} name
 * @property {string} status
 * @property {Date} birthDate
 * @property {string} tattoo
 * @property {string} colour
 * @property {string} sex
 */
/**
 * @typedef {unknown} PersonContact
 */
/**
 * @typedef PersonAndDogsDto
 * @property {string} firstName
 * @property {string} lastName
 * @property {string} birthDate
 * @property {string} personReference
 * @property {string} organisationName
 * @property {AddressDto} address
 * @property {DogDto[]} dogs
 * @property {PersonContact[]} contacts
 */

/**
 * @param indexNumber
 * @return {Promise<PersonAndDogsDto>}
 */
const getDogOwnerWithDogs = async (indexNumber) => {
  const payload = await get(`dog-owner/${indexNumber}?includeDogs=true`, options)
  return payload.owner
}

module.exports = {
  getDogDetails,
  getDogOwner,
  getDogOwnerWithDogs
}
