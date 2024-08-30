const { userWithDisplayname } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('DDI API user', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { callDelete } = require('../../../../app/api/ddi-index-api/base')

  const { userLogout } = require('../../../../app/api/ddi-index-api/user')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('deletes the entry of calling user in user cache', async () => {
    await userLogout(userWithDisplayname)
    expect(callDelete).toHaveBeenCalledWith('user/cache/my', expect.anything())
  })
})
