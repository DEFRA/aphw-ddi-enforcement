const { get } = require('./base')

const dogEndpoint = 'dog'

/**
 * @param indexNumber
 * @param user
 * @return {Promise<string|CreatedDogEvent|*>}
 */
const getDogDetails = async (indexNumber, user) => {
  const payload = await get(`${dogEndpoint}/${indexNumber}`, user)
  return payload.dog
}

/**
 * @param indexNumber
 * @param user
 * @return {Promise<string|OwnerCreatedEvent|*>}
 */
const getDogOwner = async (indexNumber, user) => {
  const payload = await get(`dog-owner/${indexNumber}`, user)
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
 * @param user
 * @return {Promise<PersonAndDogsDto>}
 */
const getDogOwnerWithDogs = async (indexNumber, user) => {
  const payload = await get(`dog-owner/${indexNumber}?includeDogs=true`, user)
  return payload.owner
}

module.exports = {
  getDogDetails,
  getDogOwner,
  getDogOwnerWithDogs
}
