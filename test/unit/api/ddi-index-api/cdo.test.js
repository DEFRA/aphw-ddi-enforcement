const { user } = require('../../../mocks/auth')

describe('CDO API endpoints', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { get, boomRequest } = require('../../../../app/api/ddi-index-api/base')

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

  describe('getManageCdoDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getManageCdoDetails('ED123', user)

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', user)
      expect(res).toEqual({ tasks: {} })
    })
  })

  describe('getCdoTaskDetails', () => {
    test('should do GET to API with correct endpoint', async () => {
      get.mockResolvedValue({ tasks: {} })
      const res = await cdo.getCdoTaskDetails('ED123', user)

      expect(get).toHaveBeenCalledWith('cdo/ED123/manage', user)
      expect(res).toEqual({ tasks: {} })
    })
  })

  describe('saveCdoTaskDetails', () => {
    test('should do POST to API with correct endpoint and payload', async () => {
      await cdo.saveCdoTaskDetails('ED123', 'submitFormTwo', { payload: 'abc' }, user)

      expect(boomRequest).toHaveBeenCalledWith('cdo/ED123/manage:submitFormTwo', 'POST', { payload: 'abc' }, user)
    })
    test('should not POST to API for non-enforcement submittable task', async () => {
      await expect(cdo.saveCdoTaskDetails('ED123', 'send-application-pack', { payload: 'abc' }, user)).rejects.toThrow(new Error('Task may not be saved'))
      expect(boomRequest).not.toHaveBeenCalled()
    })
  })
})
