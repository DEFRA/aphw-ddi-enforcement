const { validateMicrochip } = require('../../../../app/lib/validation-helpers')

const mockMicrochipHelpers = {
  state: {
    path: ['microchipNumber'],
    ancestors: [
      { dogNotFitForMicrochip: undefined, microchipVerification: undefined }
    ]
  },
  message: (a, b) => { return { error: a, elemName: b } }
}

describe('ValidationHelpers - validateMicrochip', () => {
  beforeEach(() => {
    mockMicrochipHelpers.state.ancestors = []
  })

  test('handles valid microchip', () => {
    const value = '123456789012345'

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toBe('123456789012345')
  })

  test('handles empty microchip', () => {
    const value = ''

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be 15 digits in length'
    })
  })

  test('gives error if microchip 1 too short', () => {
    const value = '12345678901234'

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be 15 digits in length'
    })
  })

  test('gives error if invalid microchip 1', () => {
    const value = '12345678901234x'

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })

  test('gives error if invalid microchip 2', () => {
    const value = '123456-78012345'

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })

  test('gives error if invalid microchip 3', () => {
    const value = '123456 78012345'

    const res = validateMicrochip(value, mockMicrochipHelpers)

    expect(res).toEqual({
      elemName: {
        path: ['microchipNumber']
      },
      error: 'Microchip number must be digits only'
    })
  })
})
