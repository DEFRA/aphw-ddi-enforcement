const Joi = require('joi')
const { isFuture, isWithinInterval, sub, addMonths, startOfDay, differenceInYears } = require('date-fns')
const { parseDate } = require('./date-helpers')
const { getPersonAndDogs } = require('../api/ddi-index-api/person')
const validNewMicrochip = /^\d+$/

const invalidBreedForCountryMessage = 'Address for an XL Bully must be in England or Wales'

const validateMicrochip = (value, helpers, compareOrig = false) => {
  let elemName = helpers.state.path[0]

  // Compare new value against original to determine if already pre-populated in the DB
  // (old microchip numbers from legacy data can contain letters so don't validate against new rules)
  if (compareOrig) {
    if (elemName?.length > 1) {
      elemName = elemName.substring(0, 1).toUpperCase() + elemName.substring(1)
    }
    if (value === helpers.state.ancestors[0][`orig${elemName}`]) {
      return value
    }
  }

  if (value?.length < 15) {
    return helpers.message('Microchip number must be 15 digits in length', { path: [elemName] })
  }

  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip number must be digits only', { path: [elemName] })
  }

  return value
}

module.exports = {
  validateMicrochip
}
