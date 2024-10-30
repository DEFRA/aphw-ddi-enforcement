const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')
const { reportTypes } = require('../../../../../../app/constants/cdo/report')

describe('Report type test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/lib/report-helper')
  const { getCdoOrPerson, determineScreenAfterReportType } = require('../../../../../../app/lib/report-helper')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails, clearReportSession, setReportTypeDetails } = require('../../../../../../app/session/report')

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

  describe('GET /cdo/report/report-type', () => {
    test('owner route clears session data when extra param provided', async () => {
      getReportTypeDetails.mockReturnValue()
      getCdoOrPerson.mockResolvedValue({
        firstName: 'John',
        lastName: 'Smith'
      })

      const options = {
        method: 'GET',
        url: '/cdo/report/report-type/P-123-456/owner/clear',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(clearReportSession).toHaveBeenCalledTimes(1)
    })

    test('dog route returns 200 when data from DB', async () => {
      getReportTypeDetails.mockReturnValue()
      getCdoOrPerson.mockResolvedValue({
        dog: {
          indexNumber: 'ED123000'
        }
      })

      const options = {
        method: 'GET',
        url: '/cdo/report/report-type/ED123000/dog',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(getCdoOrPerson).toHaveBeenCalledWith('dog', 'ED123000', expect.anything())
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('Dog ED123000')
      expect(clearReportSession).not.toHaveBeenCalled()
    })

    test('owner route returns 200 when data from DB', async () => {
      getReportTypeDetails.mockReturnValue()
      getCdoOrPerson.mockResolvedValue({
        firstName: 'John',
        lastName: 'Smith',
        dogs: [
          { indexNumber: 'ED123' },
          { indexNumber: 'ED456' }
        ]
      })

      const options = {
        method: 'GET',
        url: '/cdo/report/report-type/P-123-456/owner',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      expect(getCdoOrPerson).toHaveBeenCalledWith('owner', 'P-123-456', expect.anything())
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('John Smith')
    })

    test('missing PK returns 404', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/report/report-type//owner',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })

    test('missing sourceType returns 404', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/report/report-type/ED123000/',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })

    test('redirects when user not accepted licence or verified', async () => {
      getRedirectForUserAccess.mockReturnValue('/redirect-here')

      const options = {
        method: 'GET',
        url: '/cdo/report/report-type/P-123-456/owner',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/redirect-here')
    })

    test('returns 404 when pk not found', async () => {
      getCdoOrPerson.mockResolvedValue()

      const options = {
        method: 'GET',
        url: '/cdo/report/report-type/ED123000/dog',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/report/report-type', () => {
    test('invalid payload returns 400', async () => {
      determineScreenAfterReportType.mockResolvedValue()
      const payload = {
        indexNumber: 'ED123456'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/report-type/ED123456/dog',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('valid payload forwards onto next screen when valid payload', async () => {
      determineScreenAfterReportType.mockResolvedValue({ nextScreen: '/next-screen' })
      const payload = {
        sourceType: 'dog',
        pk: 'ED123456',
        reportType: reportTypes.inBreach
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/report-type/ED123456/dog',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/next-screen')
    })

    test('valid payload handles override', async () => {
      determineScreenAfterReportType.mockResolvedValue({ nextScreen: '/next-screen', override: { indexNumber: 'ED123456' } })
      const payload = {
        sourceType: 'owner',
        pk: 'P-123-456',
        reportType: reportTypes.inBreach
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/report-type/P-123-456/owner',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/next-screen')
      expect(setReportTypeDetails).toHaveBeenCalledWith(expect.anything(), {
        sourceType: 'owner',
        pk: 'P-123-456',
        reportType: 'in-breach',
        dogChosen: {
          indexNumber: 'ED123456'
        }
      })
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
