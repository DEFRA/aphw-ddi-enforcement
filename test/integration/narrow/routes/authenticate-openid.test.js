process.env.AUTHENTICATION_ENABLED = 'true'

describe('Authenticate test', () => {
  const createServer = require('../../../../app/server')
  let server

  const mockOpenIdAuth = {
    ivPublicKey: '',
    client: {
      endSessionUrl: jest.fn(),
      callbackParams: jest.fn(),
      callback: jest.fn(),
      userinfo: jest.fn()
    },
    configuration: {
      postLogoutUri: ''
    }
  }

  jest.mock('../../../../app/auth/openid-auth')
  const { getAuth, getResult } = require('../../../../app/auth/openid-auth')

  jest.mock('../../../../app/api/ddi-index-api/user')
  const { validateUser, isLicenceAccepted, isEmailVerified } = require('../../../../app/api/ddi-index-api/user')

  jest.mock('../../../../app/auth/logout')
  const { logoutUser } = require('../../../../app/auth/logout')

  jest.mock('../../../../app/session/session-wrapper')
  const { getFromSession } = require('../../../../app/session/session-wrapper')

  beforeEach(async () => {
    getAuth.mockResolvedValue(mockOpenIdAuth)
    getFromSession.mockReturnValue('/cdo/search/basic')
    server = await createServer()
    await server.initialize()
  })

  test('GET /authenticate route returns 302 to forward onto search page', async () => {
    isLicenceAccepted.mockResolvedValue(false)
    isEmailVerified.mockResolvedValue(true)
    getResult.mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      idTokenDecoded: 'idTokenDecoded',
      userinfo: JSON.stringify({ email: 'me@example.com' }, null, 2),
      coreIdentity: 'coreIdentity'
    })

    const options = {
      method: 'GET',
      url: '/authenticate',
      headers: {
        'x-forwarded-proto': 'http',
        host: 'localhost:3003',
        Cookie: 'nonce=abcdede;state=fghijkl;'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/search/basic')
  })
  test('GET /authenticate route for unregistered user returns 302 and logs user out', async () => {
    validateUser.mockRejectedValue({})

    getResult.mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      idTokenDecoded: 'idTokenDecoded',
      userinfo: JSON.stringify({ email: 'me@example.com' }, null, 2),
      coreIdentity: 'coreIdentity'
    })

    const options = {
      method: 'GET',
      url: '/authenticate',
      headers: {
        'x-forwarded-proto': 'http',
        host: 'localhost:3003',
        Cookie: 'nonce=abcdede;state=fghijkl;'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(logoutUser).toHaveBeenCalledWith('idToken', 'http://localhost:3003/unauthorised')
  })

  test('GET /authenticate route for unregistered user returns 302 and logs user out & no x-forwarded-proto', async () => {
    validateUser.mockRejectedValue()

    getResult.mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      idTokenDecoded: 'idTokenDecoded',
      userinfo: JSON.stringify({ email: 'me@example.com' }, null, 2),
      coreIdentity: 'coreIdentity'
    })

    const options = {
      method: 'GET',
      url: '/authenticate',
      headers: {
        host: 'localhost:3003',
        Cookie: 'nonce=abcdede;state=fghijkl;'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(logoutUser).toHaveBeenCalledWith('idToken', 'http://localhost:3003/unauthorised')
  })

  test('GET /authenticate route returns 500', async () => {
    const options = {
      method: 'GET',
      url: '/authenticate?error=true&error_description=an%20error'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    await server.stop()
  })
})
