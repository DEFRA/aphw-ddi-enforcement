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

      expect(get).toHaveBeenCalledWith('cdo/ED123', user)
    })
  })

  describe('getCdoFromActivities', () => {
    test('getCdo should do GET to API', async () => {
      get.mockResolvedValue({ cdo: {} })
      await cdo.getCdoFromActivities('ED123', user)

      expect(get).toHaveBeenCalledTimes(1)
      expect(get).toHaveBeenCalledWith('cdo/ED123?type=activity', user)
    })
  })
})
