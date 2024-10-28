const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { JSDOM } = require('jsdom')
const { countries: mockCountries } = require('../../../../../mocks/countries')

describe('Address edit test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  jest.mock('../../../../../../app/api/ddi-index-api/countries')
  const { getCountries } = require('../../../../../../app/api/ddi-index-api/countries')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails } = require('../../../../../../app/session/report')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getCountries.mockResolvedValue(mockCountries)
    getRedirectForUserAccess.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/report/address route returns 200', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const options = {
      method: 'GET',
      url: '/cdo/report/address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/report/address route redirects when user not accepted licence or verified', async () => {
    getRedirectForUserAccess.mockResolvedValue('/redirect-here')
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const options = {
      method: 'GET',
      url: '/cdo/report/address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/redirect-here')
  })

  test('GET /cdo/report/address route returns 404 if invalid session', async () => {
    getReportTypeDetails.mockReturnValue()

    const options = {
      method: 'GET',
      url: '/cdo/report/address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/report/address route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/report/address',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/report/address with invalid data returns error', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const payload = {
      addressLine2: 'locality',
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toBe('Error: Enter first line of address')
  })

  test('POST /cdo/report/address with valid data forwards to next screen', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const payload = {
      addressLine1: '1 Testing Street',
      town: 'Testington',
      postcode: 'AB1 1TT',
      country: 'Wales'
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/cdo/report/confirmation')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
