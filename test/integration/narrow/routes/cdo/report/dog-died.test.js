const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Dog died test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails } = require('../../../../../../app/session/report')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getRedirectForUserAccess.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/report/dog-died', () => {
    test('route returns 200', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const options = {
        method: 'GET',
        url: '/cdo/report/dog-died',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('Dog ED123000')
    })

    test('redirects when user not accepted licence or verified', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
      getRedirectForUserAccess.mockReturnValue('/redirect-here')

      const options = {
        method: 'GET',
        url: '/cdo/report/dog-died',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/redirect-here')
    })

    test('GET /cdo/report/dog-died route returns 404 if invalid session', async () => {
      getReportTypeDetails.mockReturnValue()

      const options = {
        method: 'GET',
        url: '/cdo/report/dog-died',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/report/dog-died', () => {
    test('invalid payload returns 400', async () => {
      const payload = {
        sourceType: 'dog',
        pk: 'ED123000'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/dog-died',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('missing date returns 400', async () => {
      const payload = {}

      const options = {
        method: 'POST',
        url: '/cdo/report/dog-died',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('Enter a Date of death')
    })

    test('valid payload forwards onto confirm screen when valid payload', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const payload = {
        dateOfDeath: '2024-05-01',
        'dateOfDeath-year': '2024',
        'dateOfDeath-month': '05',
        'dateOfDeath-day': '01'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/dog-died',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/cdo/report/confirmation')
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
