const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Accessibility test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /accessibility route returns 200 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[7].textContent.trim()).toContain('This accessibility statement applies to the Dangerous Dogs Index')
  })

  test('GET /accessibility route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/accessibility',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[7].textContent.trim()).toContain('This accessibility statement applies to the Dangerous Dogs Index')
  })

  afterEach(async () => {
    await server.stop()
  })
})
