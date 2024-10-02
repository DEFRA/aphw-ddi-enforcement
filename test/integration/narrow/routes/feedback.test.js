const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Feedback test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  // jest.mock('../../../../app/api/ddi-index-api/user')
  // const { setLicenceAccepted, isEmailVerified, sendVerifyEmail } = require('../../../../app/api/ddi-index-api/user')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /feedback route returns 302 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/feedback'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Ffeedback')
  })

  test('GET /feedback route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/feedback',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[7].textContent.trim()).toContain('To access the Dangerous Dogs Index, you must read and agree to the terms of the secure access licence listed below.')
  })

  test('POST /feedback route returns 302 for no auth', async () => {
    // sendFeedback.mockResolvedValue(true)
    const options = {
      method: 'POST',
      url: '/feedback'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Ffeedback')
  })

  test('POST /feedback route returns 400 when auth but invalid content', async () => {
    // setLicenceAccepted.mockResolvedValue(true)
    const payload = {
    }
    const options = {
      method: 'POST',
      url: '/feedback',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('Tick the box to continue')
  })

  test('POST /feedback route forwards to previous page when auth and valid content', async () => {
    // setLicenceAccepted.mockResolvedValue(true)
    const payload = {
      accept: 'Y'
    }
    const options = {
      method: 'POST',
      url: '/feedback',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/search/basic')
  })

  afterEach(async () => {
    await server.stop()
  })
})
