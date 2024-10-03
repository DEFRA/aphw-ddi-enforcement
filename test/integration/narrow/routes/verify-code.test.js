const { standardAuth, user } = require('../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('verify code test', () => {
  jest.mock('../../../../app/auth')
  const mockAuth = require('../../../../app/auth')

  jest.mock('../../../../app/api/ddi-index-api/user')
  const { isCodeCorrect, sendVerifyEmail } = require('../../../../app/api/ddi-index-api/user')

  const createServer = require('../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /verify-code route returns 302 with no auth', async () => {
    const options = {
      method: 'GET',
      url: '/verify-code'
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Fverify-code')
    expect(sendVerifyEmail).not.toHaveBeenCalled()
  })

  test('GET /verify-code route returns 200 for standard users', async () => {
    const options = {
      method: 'GET',
      url: '/verify-code',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(sendVerifyEmail).not.toHaveBeenCalled()
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('p')[8].textContent.trim()).toContain('The email contains a 6 digit security code.')
  })

  test('GET /verify-code route resends email if param supplied', async () => {
    const options = {
      method: 'GET',
      url: '/verify-code?resend=true',
      auth: standardAuth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(sendVerifyEmail).toHaveBeenCalledWith(user)
    expect(response.headers.location).toBe('/verify-code')
  })

  test('POST /verify-code route returns 302 for no auth', async () => {
    isCodeCorrect.mockResolvedValue(true)
    const payload = {}
    const options = {
      method: 'POST',
      url: '/verify-code',
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/login?next=%2Fverify-code')
  })

  test('POST /verify-code route returns 400 when auth but empty code', async () => {
    isCodeCorrect.mockResolvedValue(true)
    const payload = {}
    const options = {
      method: 'POST',
      url: '/verify-code',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('Please enter a 6 digit code')
  })

  test('POST /verify-code route forwards to search screen when auth and correct code', async () => {
    isCodeCorrect.mockResolvedValue('Ok')
    const payload = {
      code: '123456'
    }
    const options = {
      method: 'POST',
      url: '/verify-code',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/search/basic')
  })

  test('POST /verify-code route stays show validation error when code is incorrect', async () => {
    isCodeCorrect.mockResolvedValue('Incorrect')
    const payload = {
      code: '111111'
    }
    const options = {
      method: 'POST',
      url: '/verify-code',
      auth: standardAuth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = new JSDOM(response.payload).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('The code you entered is not correct')
  })

  afterEach(async () => {
    await server.stop()
  })
})
