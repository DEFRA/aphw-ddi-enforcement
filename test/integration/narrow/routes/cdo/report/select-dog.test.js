const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

const twoDogs = {
  dogs: [
    { indexNumber: 'ED900001' },
    { indexNumber: 'ED900002' }
  ]
}

const threeDogs = {
  dogs: [
    { indexNumber: 'ED120000' },
    { indexNumber: 'ED130000' },
    { indexNumber: 'ED140000' }
  ]
}

describe('Select dog test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/person')
  const { getPersonAndDogs } = require('../../../../../../app/api/ddi-index-api/person')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails } = require('../../../../../../app/session/report')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getRedirectForUserAccess.mockResolvedValue()
    getPersonAndDogs.mockResolvedValue(twoDogs)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/report/select-dog', () => {
    test('route returns 200 for two dogs', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'owner', pk: 'P-123-456', firstName: 'John', lastName: 'Smith' })

      const options = {
        method: 'GET',
        url: '/cdo/report/select-dog',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)
      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelectorAll('.govuk-caption-l')[0].textContent.trim()).toBe('John Smith')
    })

    test('route returns 200 for three dogs', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'owner', pk: 'P-123-456', firstName: 'John', lastName: 'Smith' })
      getPersonAndDogs.mockResolvedValue(threeDogs)

      const options = {
        method: 'GET',
        url: '/cdo/report/select-dog',
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
        url: '/cdo/report/select-dog',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(response.headers.location).toBe('/redirect-here')
    })

    test('GET /cdo/report/select-dog route returns 404 if invalid session', async () => {
      getReportTypeDetails.mockReturnValue()

      const options = {
        method: 'GET',
        url: '/cdo/report/select-dog',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(404)
    })
  })

  describe('POST /cdo/report/select-dog', () => {
    test('invalid payload returns 400', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
      const payload = {
        sourceType: 'dog',
        pk: 'ED123000'
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/select-dog',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('valid payload forwards onto next screen when valid payload', async () => {
      getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

      const payload = {
        dog: 1
      }

      const options = {
        method: 'POST',
        url: '/cdo/report/select-dog',
        auth,
        payload
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(302)
      expect(response.headers.location.startsWith('/cdo/report/something-else?src=')).toBeTruthy()
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
