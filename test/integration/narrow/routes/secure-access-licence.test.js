const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Secure access licence test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/api/ddi-index-api/user')
  const { setLicenceAccepted, isEmailVerified, sendVerifyEmail } = require('../../../../app/api/ddi-index-api/user')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /secure-access-licence route returns 302 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/secure-access-licence'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Fsecure-access-licence')
  })

  test('GET /secure-access-licence route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/secure-access-licence',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[7].textContent.trim()).toContain('To access the Dangerous Dogs Index, you must read and agree to the terms of the secure access licence listed below.')
  })

  test('POST /secure-access-licence route returns 302 for no auth', async () => {
    setLicenceAccepted.mockResolvedValue(true)
    const options = {
      method: 'POST',
      url: '/secure-access-licence'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Fsecure-access-licence')
  })

  test('POST /secure-access-licence route returns 400 when auth but not ticked checkbox', async () => {
    setLicenceAccepted.mockResolvedValue(true)
    const payload = {
    }
    const options = {
      method: 'POST',
      url: '/secure-access-licence',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('Tick the box to continue')
  })

  test('POST /secure-access-licence route forwards to search screen when auth and ticked checkbox', async () => {
    setLicenceAccepted.mockResolvedValue(true)
    isEmailVerified.mockResolvedValue(true)
    const payload = {
      accept: 'Y'
    }
    const options = {
      method: 'POST',
      url: '/secure-access-licence',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/search/basic')
  })

  test('POST /secure-access-licence route stays on search screen when set licence fails', async () => {
    setLicenceAccepted.mockResolvedValue(false)
    isEmailVerified.mockResolvedValue(true)
    const payload = {
      accept: 'Y'
    }
    const options = {
      method: 'POST',
      url: '/secure-access-licence',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/secure-access-licence')
  })

  test('POST /secure-access-licence route sends email and forwards to verify code screen when ticked checkbox but email not verified', async () => {
    setLicenceAccepted.mockResolvedValue(true)
    isEmailVerified.mockResolvedValue(false)
    const payload = {
      accept: 'Y'
    }
    const options = {
      method: 'POST',
      url: '/secure-access-licence',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/verify-code')
    expect(sendVerifyEmail).toHaveBeenCalledWith(user)
  })

  afterEach(async () => {
    await server.stop()
  })
})
