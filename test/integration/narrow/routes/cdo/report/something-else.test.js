const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Something else test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails } = require('../../../../../../app/session/report')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  jest.mock('../../../../../../app/api/ddi-index-api/user')
  const { submitReportSomething } = require('../../../../../../app/api/ddi-index-api/user')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getRedirectForUserAccess.mockResolvedValue()
    submitReportSomething.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/report/something-else', () => {
    test('dog route returns 200', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const options = {
        method: 'GET',
        url: '/cdo/report/something-else',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('Dog ED123000')
    })

    test('owner route returns 200', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'owner', pk: 'P-123-456', firstName: 'John', lastName: 'Smith' })

      const options = {
        method: 'GET',
        url: '/cdo/report/something-else',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('John Smith')
    })

    test('redirects when user not accepted licence or verified', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
      getRedirectForUserAccess.mockReturnValue('/redirect-here')

      const options = {
        method: 'GET',
        url: '/cdo/report/something-else',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/redirect-here')
    })

    test('GET /cdo/report/something-else route returns 404 if invalid session', async () => {
      getReportTypeDetails.mockReturnValue()

      const options = {
        method: 'GET',
        url: '/cdo/report/something-else',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/report/something-else', () => {
    test('invalid payload returns 400', async () => {
      const payload = {
        sourceType: 'dog',
        pk: 'ED123000'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/something-else',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('text too long returns 400', async () => {
      const payload = {
        details: 'A'.repeat(1201)
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/something-else',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-error-message')[0].textContent.trim()).toContain('Details must be 1200 characters or less')
    })

    test('valid payload forwards onto confirm screen when valid payload', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const payload = {
        details: 'Some example text'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/something-else',
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
