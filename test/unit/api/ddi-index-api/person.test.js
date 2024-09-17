const { getPersonAndDogs, getPersonByReference } = require('../../../../app/api/ddi-index-api/person')
const { get } = require('../../../../app/api/ddi-index-api/base')
const { user } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('Person test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getPersonAndDogs', () => {
    test('getPersonAndDogs calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersonAndDogs('P-123', user)
      expect(get).toHaveBeenCalledWith('person/P-123?includeDogs=true', user)
    })
  })

  describe('getPersonByReference', () => {
    test('getPersonByReference calls endpoint', async () => {
      get.mockResolvedValue({ payload: {} })
      await getPersonByReference('P-123', user)
      expect(get).toHaveBeenCalledWith('person/P-123', user)
    })
  })
})
