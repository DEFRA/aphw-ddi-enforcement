const { auth, userWithDisplayname } = require('../../../mocks/auth')
const environmentStubs = require('../../../../app/lib/environment-helpers')

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

  jest.mock('../../../../app/auth/logout')
  const { logoutUser } = require('../../../../app/auth/logout')

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue({
      ...userWithDisplayname
    })
    getAuth.mockResolvedValue(mockOpenIdAuth)

    server = await createServer()
    await server.initialize()
  })

  afterEach(() => {
    jest.clearAllMocks()
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

  test('GET /logout route returns 302 given POST_LOGOUT_URL set', async () => {
    jest.spyOn(environmentStubs, 'getEnvironmentVariableOrString').mockImplementation(envVar => {
      if (envVar === 'POST_LOGOUT_URL') {
        return 'https://example.com/post-logout'
      }
      return process.env[envVar] ?? ''
    })
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

  test('GET /logout route returns 302 despite api call throwing', async () => {
    mockAuth.logout.mockResolvedValue(true)
    userLogout.mockImplementation(() => { throw new Error('dummy error') })

    const options = {
      method: 'GET',
      url: '/logout',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(userLogout).toHaveBeenCalled()
  })

  test('GET /logout route returns 302 and adds param', async () => {
    mockAuth.logout.mockResolvedValue(true)

    const options = {
      method: 'GET',
      url: '/logout?feedback=true',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(logoutUser).toHaveBeenCalledWith(undefined, null, '?feedback=true')
  })

  afterEach(async () => {
    await server.stop()
  })
})
