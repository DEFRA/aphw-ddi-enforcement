const { auth, user } = require('../../../../../mocks/auth')
const { JSDOM } = require('jsdom')

describe('Confirmation test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/lib/route-helpers')
  const { getRedirectForUserAccess } = require('../../../../../../app/lib/route-helpers')

  jest.mock('../../../../../../app/session/report')
  const { getReportTypeDetails } = require('../../../../../../app/session/report')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getRedirectForUserAccess.mockResolvedValue()
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/report/confirmation route returns 200', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const options = {
      method: 'GET',
      url: '/cdo/report/confirmation',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('.govuk-panel__body')[0].textContent.trim()).toBe('Dog ED123000')
  })

  test('GET /cdo/report/confirmation route returns 200 with owner sourceType', async () => {
    getReportTypeDetails.mockReturnValue({
      sourceType: 'owner',
      pk: 'P-DA08-8028',
      dogs: ['ED300000', 'ED400140'],
      firstName: 'Robo',
      lastName: 'Cop',
      reportType: 'something-else',
      dogChosen: {
        indexNumber: 'ED300000',
        arrayInd: 1
      }
    })

    const options = {
      method: 'GET',
      url: '/cdo/report/confirmation',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelectorAll('#main-content .govuk-link')[0].textContent.trim()).toBe('Owner record for Robo Cop')
  })

  test('GET /cdo/report/confirmation route redirects when user not accepted licence or verified', async () => {
    getRedirectForUserAccess.mockResolvedValue('/redirect-here')
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })

    const options = {
      method: 'GET',
      url: '/cdo/report/confirmation',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/redirect-here')
  })

  test('GET /cdo/report/confirmation route returns 404 if invalid session', async () => {
    getReportTypeDetails.mockReturnValue()

    const options = {
      method: 'GET',
      url: '/cdo/report/confirmation',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
