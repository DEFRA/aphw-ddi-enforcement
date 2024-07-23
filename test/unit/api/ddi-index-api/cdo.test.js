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
      await cdo.getCdo('ED123')

      expect(get).toHaveBeenCalledTimes(1)
    })
  })

  describe('getManageCdoDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getManageCdoDetails('ED123')

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', { json: true })
      expect(res).toEqual({ tasks: {} })
    })
  })

  describe('getCdoTaskDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getCdoTaskDetails('ED123', 'send-application-pack456')

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', { json: true })
      expect(res).toEqual({ tasks: {} })
    })
  })
})
