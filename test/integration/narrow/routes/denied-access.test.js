const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Denied-access test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /denied-access route returns 401 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/denied-access'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(401)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('h1')[0].textContent.trim()).toContain('You cannot currently use this service - speak to your force\'s dangerous dogs team.')
  })

  test('GET /denied-access route returns 401 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/denied-access',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(401)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('h1')[0].textContent.trim()).toContain('You cannot currently use this service - speak to your force\'s dangerous dogs team.')
  })

  afterEach(async () => {
    await server.stop()
  })
})
