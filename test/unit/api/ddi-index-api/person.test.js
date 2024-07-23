const { getPersonAndDogs, getPersonByReference } = require('../../../../app/api/ddi-index-api/person')
const { get } = require('../../../../app/api/ddi-index-api/base')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Person test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPersonAndDogs', () => {
    test('getPersonAndDogs calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersonAndDogs('P-123')
      expect(get).toHaveBeenCalledWith('person/P-123?includeDogs=true', expect.anything())
    })
  })

  describe('getPersonByReference', () => {
    test('getPersonByReference calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersonByReference('P-123')
      expect(get).toHaveBeenCalledWith('person/P-123')
    })
  })
})
