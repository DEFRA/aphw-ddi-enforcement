const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

const breachList = [
  { id: 1, label: 'Reason 1 label', short_name: 'R_1' },
  { id: 2, label: 'Reason 2 label', short_name: 'R_2' },
  { id: 3, label: 'Reason 3 label', short_name: 'R_3' }
]

describe('Breach reasons test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/dog-breaches')
  const { getBreachCategories } = require('../../../../../../app/api/ddi-index-api/dog-breaches')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails } = require('../../../../../../app/session/report')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getRedirectForUserAccess.mockResolvedValue()
    getBreachCategories.mockResolvedValue(breachList)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/report/breach-reasons', () => {
    test('route returns 200', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const options = {
        method: 'GET',
        url: '/cdo/report/breach-reasons',
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
        url: '/cdo/report/breach-reasons',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/redirect-here')
    })

    test('GET /cdo/report/breach-reasons route returns 404 if invalid session', async () => {
      getReportTypeDetails.mockReturnValue()

      const options = {
        method: 'GET',
        url: '/cdo/report/breach-reasons',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/report/breach-reasons', () => {
    test('invalid payload returns 400', async () => {
      const payload = {
        sourceType: 'dog',
        pk: 'ED123000'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/breach-reasons',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('valid payload forwards onto confirm screen when valid payload', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const payload = {
        dogBreaches: ['1']
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/breach-reasons',
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
