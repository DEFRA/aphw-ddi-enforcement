const validNewMicrochip = /^\d+$/

const FIFTEEN = 15

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

  if (value?.length < FIFTEEN) {
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