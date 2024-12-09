const validNewMicrochip = /^\d+$/

const FIFTEEN = 15

const validateMicrochip = (value, helpers) => {
  const elemName = helpers.state.path[0]

  const dogNotFitForMicrochip = helpers.state.ancestors[0]?.dogNotFitForMicrochip
  if (dogNotFitForMicrochip !== undefined && (value === undefined || value === '')) {
    return value
  }

  const microchipDate = helpers.state.ancestors[0]?.microchipVerification
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
