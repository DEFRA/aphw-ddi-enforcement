const { auth, userWithDisplayname } = require('../../../mocks/auth')

describe('Logout test', () => {
  const createServer = require('../../../../app/server')
  let server
  const mockOpenIdAuth = {
    ivPublicKey: '',
    client: {
      endSessionUrl: jest.fn()
    },
    configuration: {
      postLogoutUri: ''
    }
  }

  jest.mock('../../../../app/auth/openid-auth')
  const { getAuth } = require('../../../../app/auth/openid-auth')

  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/api/ddi-index-api/user')
  const { userLogout } = require('../../../../app/api/ddi-index-api/user')

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue({
      ...userWithDisplayname
    })
    getAuth.mockResolvedValue(mockOpenIdAuth)

    server = await createServer()
    await server.initialize()
  })

  test('GET /logout route returns 302', async () => {
    mockAuth.logout.mockResolvedValue(true)

    const options = {
      method: 'GET',
      url: '/logout',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(userLogout).toHaveBeenCalled()
  })

  afterEach(async () => {
    await server.stop()
  })
})
