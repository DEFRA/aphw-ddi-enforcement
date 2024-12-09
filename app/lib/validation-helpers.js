const validNewMicrochip = /^\d+$/

const FIFTEEN = 15

const isBlankDate = date => date.year === '' && date.month === '' && date.day === ''

const validateMicrochip = (value, helpers) => {
  const elemName = helpers.state.path[0]

  const dogNotFitForMicrochip = helpers.state.ancestors[0].dogNotFitForMicrochip
  const microchipDate = helpers.state.ancestors[0].microchipVerification

  // if (dogNotFitForMicrochip === undefined && isBlankDate(microchipDate)) {
  //   return value
  // }

  if (dogNotFitForMicrochip !== undefined && (value === undefined || value === '')) {
    return value
  }

  if (microchipDate !== undefined && (value === undefined || value === '')) {
    return helpers.message('Enter a microchip number', { path: [elemName] })
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
