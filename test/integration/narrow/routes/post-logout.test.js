describe('Logout test', () => {
  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    server = await createServer()
    await server.initialize()
  })

  test('GET /post-logout route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/post-logout'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /post-logout route with param returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/post-logout?feedback=true'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  afterEach(async () => {
    await server.stop()
  })
})
