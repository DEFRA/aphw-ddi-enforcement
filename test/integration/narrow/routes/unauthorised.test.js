const { auth } = require('../../../mocks/auth')

describe('Unauthorised test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /unauthorised route returns 401', async () => {
    const options = {
      method: 'GET',
      url: '/unauthorised',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(401)
  })

  afterEach(async () => {
    await server.stop()
  })
})
