const { validateDate } = require('../lib/date-helpers')

const validNewMicrochip = /^\d+$/

const FIFTEEN = 15

const isBlankDate = date => !date || (date.year === '' && date.month === '' && date.day === '')

const validateMicrochipNumber = (value, helpers) => {
  const elemName = helpers.state.path[0]

  const dogNotFitForMicrochip = helpers.state.ancestors[0]?.dogNotFitForMicrochip
  const microchipDate = helpers.state.ancestors[0]?.microchipVerification

  if (dogNotFitForMicrochip === undefined && isBlankDate(microchipDate)) {
    return null
  }

  const noMicrochip = value === undefined || value === ''

  if (dogNotFitForMicrochip !== undefined && noMicrochip) {
    return value
  }

  if (microchipDate !== undefined && noMicrochip) {
    return helpers.message('Enter a microchip number', { path: [elemName] })
  }

  if (value?.length !== FIFTEEN) {
    return helpers.message('Microchip number must be 15 digits in length', { path: [elemName] })
  }

  if (!value.match(validNewMicrochip)) {
    return helpers.message('Microchip number must be digits only', { path: [elemName] })
  }

  return value
}

const validateMicrochipVerification = (value, helpers) => {
  const elemName = helpers.state.path[0]

  const validDateOrError = validateDate(value, helpers, false, true)
  if (validDateOrError?.messages?.rendered) {
    return validDateOrError
  }

  const dogNotFitForMicrochip = helpers.state.ancestors[0]?.dogNotFitForMicrochip
  if ((dogNotFitForMicrochip !== true && isBlankDate(value)) || (dogNotFitForMicrochip === true && !isBlankDate(value))) {
    return helpers.message('Enter the date the dog’s microchip number was verified, or select ‘Dog declared unfit for microchipping by vet’', { path: [elemName, ['day', 'month', 'year']] })
  }

  return !validDateOrError ? value : validDateOrError
}

const validateNeuteringConfirmation = (value, helpers) => {
  const elemName = helpers.state.path[0]

  const validDateOrError = validateDate(value, helpers, false, true)
  if (validDateOrError?.messages?.rendered) {
    return validDateOrError
  }

  const dogNotNeutered = helpers.state.ancestors[0]?.dogNotNeutered
  if ((dogNotNeutered !== true && isBlankDate(value)) || (dogNotNeutered === true && !isBlankDate(value))) {
    return helpers.message('Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’', { path: [elemName, ['day', 'month', 'year']] })
  }

  return !validDateOrError ? value : validDateOrError
}

module.exports = {
  validateMicrochipNumber,
  validateMicrochipVerification,
  validateNeuteringConfirmation
}
