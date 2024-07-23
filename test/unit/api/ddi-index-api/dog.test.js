const { getDogDetails, getDogOwner, getDogOwnerWithDogs } = require('../../../../app/api/ddi-index-api/dog')
jest.mock('../../../../app/api/ddi-index-api/base')
const { get } = require('../../../../app/api/ddi-index-api/base')

describe('Dog test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getDogDetails', () => {
    test('getDogDetails calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogDetails('ED12345')
      expect(get).toHaveBeenCalledWith('dog/ED12345', expect.anything())
    })
  })

  describe('getDogOwner', () => {
    test('getDogOwner calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogOwner('ED12345')
      expect(get).toHaveBeenCalledWith('dog-owner/ED12345', expect.anything())
    })
  })

  describe('getDogOwnerWithDogs', () => {
    test('should calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getDogOwnerWithDogs('ED12345')
      expect(get).toHaveBeenCalledWith('dog-owner/ED12345?includeDogs=true', expect.anything())
    })
  })
})
