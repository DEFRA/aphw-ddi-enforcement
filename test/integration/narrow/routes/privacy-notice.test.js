const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Privacy notice test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /privacy-notice route returns 200 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/privacy-notice'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[6].textContent.trim()).toContain('Content TBC')
  })

  test('GET /privacy-notice route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/privacy-notice',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[6].textContent.trim()).toContain('Content TBC')
  })

  afterEach(async () => {
    await server.stop()
  })
})
