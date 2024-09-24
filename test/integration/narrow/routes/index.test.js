const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Index test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/api/ddi-index-api/user')
  const { validateUser } = require('../../../../app/api/ddi-index-api/user')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    validateUser.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  test('GET / route returns 200 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('form p')[0].textContent.trim()).toContain('This service is only for dog legislation officers working for a UK police force.')
  })

  test('GET / route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('form p')[0].textContent.trim()).toContain('This service is only for dog legislation officers working for a UK police force.')
  })

  afterEach(async () => {
    await server.stop()
  })
})
