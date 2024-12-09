const { validateMicrochipNumber } = require('../../../../app/lib/validation-helpers')

const mockMicrochipHelpers = {
  state: {
    path: ['microchipNumber'],
    ancestors: [{
      dogNotFitForMicrochip: false,
      microchipDate: { year: '2024', month: '10', day: '15' }
    }]
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validateMicrochip', () => {
  test('handles valid microchip', () => {
    const value = '123456789012345'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toBe('123456789012345')
  })

  test('handles short microchip', () => {
    const value = '12345'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be 15 digits in length'
    })
  })

  test('handles alpha microchip', () => {
    const value = '1234567890abcde'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })

  test('gives error if microchip 1 too short', () => {
    const value = '12345678901234'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be 15 digits in length'
    })
  })

  test('gives error if invalid microchip 1', () => {
    const value = '12345678901234x'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })

  test('gives error if invalid microchip 2', () => {
    const value = '123456-78012345'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })

  test('gives error if invalid microchip 3', () => {
    const value = '123456 78012345'

    const res = validateMicrochipNumber(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })
})
