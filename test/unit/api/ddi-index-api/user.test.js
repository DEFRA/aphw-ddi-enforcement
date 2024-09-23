const { userWithDisplayname } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('DDI API user', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { callDelete, get, put } = require('../../../../app/api/ddi-index-api/base')

  const { userLogout, validateUser, validateLicence, setLicenceAccepted } = require('../../../../app/api/ddi-index-api/user')

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('userLogout', () => {
    test('should delete the entry of calling user in user cache', async () => {
      await userLogout(userWithDisplayname)
      expect(callDelete).toHaveBeenCalledWith('user/me/cache', expect.anything())
    })
  })

  describe('validateUser', () => {
    test('should check if user is validated or not', async () => {
      await validateUser(userWithDisplayname)
      expect(get).toHaveBeenCalledWith('user/me/validate', expect.anything())
    })
  })

  describe('validateLicence', () => {
    test('should check if user has accepted licence or not', async () => {
      await validateLicence(userWithDisplayname)
      expect(get).toHaveBeenCalledWith('user/me/licence', expect.anything())
    })
  })

  describe('setLicenceAccepted', () => {
    test('should put licence accepted flag', async () => {
      await setLicenceAccepted(userWithDisplayname)
      expect(put).toHaveBeenCalledWith('user/me/licence', {}, expect.anything())
    })
  })
})
