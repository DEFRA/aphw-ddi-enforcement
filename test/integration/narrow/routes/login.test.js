const auth = require('../../../../app/auth')
jest.mock('../../../../app/auth')

describe('Login test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /login route returns 302', async () => {
    auth.authType = 'dev'
    auth.getAuthenticationUrl.mockReturnValue('http://test.com')

    const options = {
      method: 'GET',
      url: '/login'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('http://test.com')
  })

  test('GET /login route throws error', async () => {
    auth.authType = 'dev'
    auth.getAuthenticationUrl.mockImplementation(() => {
      throw new Error('dummy auth error')
    })

    const options = {
      method: 'GET',
      url: '/login'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(500)
  })

  test('GET /login route returns 302 for one-login', async () => {
    auth.authType = 'one-login'
    auth.getAuth = jest.fn()
    auth.getAuth.mockResolvedValue({ getAuthorizationUrl: () => 'http://one-login/auth' })

    const options = {
      method: 'GET',
      url: '/login'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('http://one-login/auth')
  })

  afterEach(async () => {
    await server.stop()
  })
})
