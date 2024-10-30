const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { JSDOM } = require('jsdom')

describe('PostCode Lookup test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/lib/back-helpers')
  const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../../../../app/lib/back-helpers')

  jest.mock('../../../../../../app/session/report')
  const { setReportTypeDetails, getReportTypeDetails } = require('../../../../../../app/session/report')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    addBackNavigation.mockReturnValue({ backLink: '/back', srcHashParam: '?src=src-hash-param' })
    addBackNavigationForErrorCondition.mockReturnValue({ backLink: '/back', srcHashParam: '?src=src-hash-param' })
    setReportTypeDetails.mockReturnValue()
    getReportTypeDetails.mockReturnValue()
    getRedirectForUserAccess.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/report/postcode-lookup route returns 200', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const options = {
      method: 'GET',
      url: '/cdo/report/postcode-lookup',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = new JSDOM(response.payload).window

    expect(document.querySelector('.govuk-back-link').getAttribute('href')).toBe('/back')
  })

  test('GET /cdo/report/postcode-lookup redirects if licence not accepted or user not verified', async () => {
    getRedirectForUserAccess.mockResolvedValue('/redirect-here')
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const options = {
      method: 'GET',
      url: '/cdo/report/postcode-lookup',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/redirect-here')
  })

  test('GET /cdo/report/postcode-lookup route returns 404 if invalid session', async () => {
    getReportTypeDetails.mockReturnValue()

    const options = {
      method: 'GET',
      url: '/cdo/report/postcode-lookup',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('POST /cdo/report/postcode-lookup route returns 302 if not auth', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const fd = new FormData()

    const options = {
      method: 'POST',
      url: '/cdo/report/postcode-lookup',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/report/postcode-lookup with missing postcode returns error 1', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const payload = {
      houseNumber: '1'
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/report/postcode-lookup with empty postcode returns error 1', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const payload = {
      houseNumber: '1',
      postcode: ''
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
    expect(response.result.indexOf('Enter a postcode')).toBeGreaterThan(-1)
  })

  test('POST /cdo/report/postcode-lookup with valid data forwards to next screen', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const nextScreenUrl = '/cdo/report/select-address'

    const payload = {
      postcode: 'AB1 1TT'
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location.startsWith(`${nextScreenUrl}?src=`)).toBeTruthy()
  })

  test('POST /cdo/report/postcode-lookup with all data forwards to next screen', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const nextScreenUrl = '/cdo/report/select-address'

    const payload = {
      postcode: 'AB1 1TT',
      houseNumber: '2'
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/postcode-lookup',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location.startsWith(`${nextScreenUrl}?src=`)).toBeTruthy()
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
