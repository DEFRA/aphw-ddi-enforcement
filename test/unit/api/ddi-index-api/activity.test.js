const { getActivities, getActivityById, getAllActivities } = require('../../../../app/api/ddi-index-api/activities')
const { get } = require('../../../../app/api/ddi-index-api/base')
const { user } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

jest.mock('../../../../app/api/ddi-index-api/dog')

describe('Activity test', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('getActivities calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getActivities('activityType', 'activitySource', user)
    expect(get).toHaveBeenCalledWith('activities/activityType/activitySource', user)
  })

  test('getActivityById calls endpoint', async () => {
    get.mockResolvedValue({ payload: {} })
    await getActivityById('activityId', user)
    expect(get).toHaveBeenCalledWith('activity/activityId', user)
  })

  test('getAllActivities calls correct endpoints', async () => {
    get.mockResolvedValue({ payload: {} })
    await getAllActivities(user)
    expect(get).toHaveBeenCalledTimes(4)
    expect(get.mock.calls[0]).toEqual(['activities/sent/dog', user])
    expect(get.mock.calls[1]).toEqual(['activities/received/dog', user])
    expect(get.mock.calls[2]).toEqual(['activities/sent/owner', user])
    expect(get.mock.calls[3]).toEqual(['activities/received/owner', user])
  })
})
