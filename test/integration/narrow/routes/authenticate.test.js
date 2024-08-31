jest.mock('../../../../app/auth')
const auth = require('../../../../app/auth')

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
  const { validateUser } = require('../../../../app/api/ddi-index-api/user')

  jest.mock('../../../../app/auth/logout')
  const { logoutUser } = require('../../../../app/auth/logout')

  beforeEach(async () => {
    getAuth.mockResolvedValue(mockOpenIdAuth)
    server = await createServer()
    await server.initialize()
  })

  test('GET /authenticate route returns 302', async () => {
    auth.authenticate.mockResolvedValue({})
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
  })

  test('GET /authenticate route for unregistered user returns 302 and logs user out', async () => {
    auth.authenticate.mockResolvedValue({})
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
    auth.authenticate.mockResolvedValue({})
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

  test('GET /authenticate route throws error', async () => {
    auth.authenticate.mockImplementation(() => {
      throw new Error('dummy auth error')
    })

    const options = {
      method: 'GET',
      url: '/authenticate'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })

  afterEach(async () => {
    await server.stop()
  })
})
