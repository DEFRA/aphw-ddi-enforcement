const { user } = require('../../../mocks/auth')
describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get } = require('../../../../app/api/ddi-index-api/base')

  const { cdo } = require('../../../../app/api/ddi-index-api')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('getCdo', () => {
    test('getCdo should do GET to API', async () => {
      get.mockResolvedValue({ cdo: {} })
      await cdo.getCdo('ED123', user)

      expect(get).toHaveBeenCalledTimes(1)
    })
  })
})
