const { userWithDisplayname } = require('../../../mocks/auth')
jest.mock('../../../../app/api/ddi-index-api/base')

describe('DDI API user', () => {
  jest.mock('../../../../app/api/ddi-index-api/base')
  const { callDelete, get, put, post } = require('../../../../app/api/ddi-index-api/base')

  const { userLogout, validateUser, isLicenceAccepted, setLicenceAccepted, isEmailVerified, sendVerifyEmail, isCodeCorrect } = require('../../../../app/api/ddi-index-api/user')

  beforeEach(() => {
    jest.clearAllMocks()
    get.mockResolvedValue({ result: 'get result' })
    put.mockResolvedValue({ result: 'put result' })
    post.mockResolvedValue({ result: 'put result' })
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

  describe('isLicenceAccepted', () => {
    test('should check if user has accepted licence or not', async () => {
      await isLicenceAccepted(userWithDisplayname)
      expect(get).toHaveBeenCalledWith('user/me/licence', expect.anything())
    })
  })

  describe('setLicenceAccepted', () => {
    test('should put licence accepted flag', async () => {
      await setLicenceAccepted(userWithDisplayname)
      expect(put).toHaveBeenCalledWith('user/me/licence', {}, expect.anything())
    })
  })

  describe('isEmailVerified', () => {
    test('should check if user has verified their email address or not', async () => {
      await isEmailVerified(userWithDisplayname)
      expect(get).toHaveBeenCalledWith('user/me/email', expect.anything())
    })
  })

  describe('sendVerifyEmail', () => {
    test('should send out email', async () => {
      await sendVerifyEmail(userWithDisplayname)
      expect(put).toHaveBeenCalledWith('user/me/email', expect.anything(), expect.anything())
    })
  })

  describe('isCodeCorrect', () => {
    test('should check if code is correct or not', async () => {
      await isCodeCorrect(userWithDisplayname)
      expect(post).toHaveBeenCalledWith('user/me/email', expect.anything(), expect.anything())
    })
  })
})
