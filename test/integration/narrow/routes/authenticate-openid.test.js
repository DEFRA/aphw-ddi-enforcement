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
  const { validateUser } = require('../../../../app/api/ddi-index-api/user')

  jest.mock('../../../../app/auth/logout')
  const { logoutUser } = require('../../../../app/auth/logout')

  jest.mock('../../../../app/session/session-wrapper')
  const { getFromSession } = require('../../../../app/session/session-wrapper')

  jest.mock('../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../app/lib/route-helpers')

  beforeEach(async () => {
    jest.clearAllMocks()
    getAuth.mockResolvedValue(mockOpenIdAuth)
    getFromSession.mockReturnValue('/cdo/search/basic')
    server = await createServer()
    await server.initialize()
  })

  test('GET /authenticate route returns 302 to forward onto search page', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
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

  test('GET /authenticate route with user-agent returns 302 to forward onto search page', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
    getResult.mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      idTokenDecoded: 'idTokenDecoded',
      userinfo: JSON.stringify({ email: 'me@example.com' }, null, 2),
      coreIdentity: 'coreIdentity'
    })
    const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:131.0) Gecko/20100101 Firefox/131.0'

    const options = {
      method: 'GET',
      url: '/authenticate',
      headers: {
        'x-forwarded-proto': 'http',
        host: 'localhost:3003',
        Cookie: 'nonce=abcdede;state=fghijkl;',
        'user-agent': userAgent
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(validateUser).toHaveBeenCalledWith({
      accessToken: 'accessToken',
      displayname: 'me@example.com',
      username: 'me@example.com',
      userAgent
    })
  })

  test('GET /authenticate route returns 302 to forward to licence if licence not accepted', async () => {
    getRedirectForUserAccess.mockResolvedValue('/secure-access-licence')
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
    expect(response.headers.location).toBe('/secure-access-licence')
  })

  test('GET /authenticate route for unregistered user returns 302 and logs user out if invalid domain', async () => {
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
    expect(logoutUser).toHaveBeenCalledWith('idToken', 'http://localhost:3003/denied')
  })

  test('GET /authenticate route for unregistered user returns 302 and logs user out if valid domain', async () => {
    validateUser.mockRejectedValue({})

    getResult.mockResolvedValue({
      accessToken: 'accessToken',
      refreshToken: 'refreshToken',
      idToken: 'idToken',
      idTokenDecoded: 'idTokenDecoded',
      userinfo: JSON.stringify({ email: 'me@example.Police.Uk' }, null, 2),
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
    expect(logoutUser).toHaveBeenCalledWith('idToken', 'http://localhost:3003/denied-access')
  })

  test('GET /authenticate route for unregistered user returns 302 and logs user out - https url', async () => {
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
        host: 'livehost',
        Cookie: 'nonce=abcdede;state=fghijkl;'
      }
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(logoutUser).toHaveBeenCalledWith('idToken', 'https://livehost/denied')
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
    expect(logoutUser).toHaveBeenCalledWith('idToken', 'http://localhost:3003/denied')
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
