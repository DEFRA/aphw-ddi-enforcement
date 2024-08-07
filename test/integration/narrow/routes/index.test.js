const { adminAuth, standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Index test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET / route returns 302 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET / route returns 200', async () => {
    const options = {
      method: 'GET',
      url: '/',
      auth: adminAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-card--dashboard')[0].textContent.trim()).toContain('Search dog index')
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
    expect(document.querySelectorAll('.govuk-card--dashboard')[0].textContent.trim()).toContain('Search')
  })

  afterEach(async () => {
    await server.stop()
  })
})
