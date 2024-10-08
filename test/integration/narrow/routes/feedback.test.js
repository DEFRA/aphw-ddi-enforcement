const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Feedback test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/api/ddi-index-api/user')
  const { submitFeedback } = require('../../../../app/api/ddi-index-api/user')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    submitFeedback.mockResolvedValue()
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
      url: '/feedback-sent',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('h1')[0].textContent.trim()).toEqual('Feedback received')
  })

  test('GET /feedback-sent route returns 302 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/feedback-sent'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Ffeedback-sent')
  })

  test('GET /feedback-sent route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/feedback',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('h1')[0].textContent.trim()).toEqual('Give feedback on the Dangerous Dogs Index')
  })

  test('POST /feedback route returns 302 for no auth', async () => {
    const options = {
      method: 'POST',
      url: '/feedback'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Ffeedback')
  })

  test('POST /feedback route returns 400 when auth but invalid content', async () => {
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
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('Select an option')
  })

  test('POST /feedback route forwards to submitted page when auth and valid content', async () => {
    const payload = {
      completedTask: 'Yes',
      satisfaction: 'Satisfied'
    }
    const options = {
      method: 'POST',
      url: '/feedback',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/feedback-sent')
  })

  test('POST /feedback route forwards to logout page when auth and valid content and redirect set', async () => {
    const payload = {
      completedTask: 'Yes',
      satisfaction: 'Satisfied'
    }
    const options = {
      method: 'POST',
      url: '/feedback?logout=true',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/logout?feedback=true')
  })

  afterEach(async () => {
    await server.stop()
  })
})
