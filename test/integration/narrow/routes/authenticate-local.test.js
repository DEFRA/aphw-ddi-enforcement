jest.mock('../../../../app/auth')
const auth = require('../../../../app/auth')

describe('Authenticate test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /authenticate route returns 302', async () => {
    auth.authenticate.mockResolvedValue({})

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
