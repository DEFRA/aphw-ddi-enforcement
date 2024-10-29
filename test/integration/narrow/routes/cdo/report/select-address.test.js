const { auth, user } = require('../../../../../mocks/auth')
const FormData = require('form-data')
const { routes } = require('../../../../../../app/constants/cdo/report')
const { getFromSession } = require('../../../../../../app/session/session-wrapper')
jest.mock('../../../../../../app/session/session-wrapper')
const { setReportTypeDetails, getReportTypeDetails } = require('../../../../../../app/session/report')
jest.mock('../../../../../../app/session/report')

describe('SelectAddress test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/os-places')
  const { getPostcodeAddresses } = require('../../../../../../app/api/os-places')

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

  test('GET /cdo/report/select-address route returns 200', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)

    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/report/select-address redirects when licence no accepted or user unverified', async () => {
    getRedirectForUserAccess.mockResolvedValue('/redirect-here')
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    getPostcodeAddresses.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/redirect-here')
  })

  test('GET /cdo/report/select-address route returns 404 if invalid session', async () => {
    getReportTypeDetails.mockReturnValue()

    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(404)
  })

  test('GET /cdo/report/select-address route returns 200 even when no addresses', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    getPostcodeAddresses.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/report/select-address route stores address in session when only one address', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    getPostcodeAddresses.mockResolvedValue([
      { addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setReportTypeDetails).toHaveBeenCalledTimes(1)
    expect(setReportTypeDetails).toHaveBeenCalledWith(expect.anything(), {
      pk: 'ED123000',
      sourceType: 'dog',
      selectedAddress: {
        addressLine1: 'addr1',
        addressLine2: 'addr2',
        town: 'town',
        postcode: 'AB1 1TT',
        country: 'England'
      }
    })
  })

  test('GET /cdo/report/select-address route doesnt store address in session when multiple addresses', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    getPostcodeAddresses.mockResolvedValue([
      { addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' },
      { addressLine1: 'addr1_2', addressLine2: 'addr2_2', town: 'town_2', postcode: 'AB1 1TT_2', country: 'England_2' }
    ])

    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setReportTypeDetails).not.toHaveBeenCalled()
  })

  test('GET /cdo/report/select-address route returns 200 even when no addresses', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    getPostcodeAddresses.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/report/select-address',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
    expect(setReportTypeDetails).not.toHaveBeenCalled()
  })

  test('POST /cdo/report/select-address route returns 302 if not auth', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const fd = new FormData()
    fd.append('firstName', 'John')
    fd.append('lastName', 'Smith')

    const options = {
      method: 'POST',
      url: '/cdo/report/select-address',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('POST /cdo/report/select-address with valid data returns 302', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    const nextScreenUrl = routes.reportConfirmation.get
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }])
    const payload = {
      address: 0
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/select-address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe(nextScreenUrl)
  })

  test('POST /cdo/report/select-address with invalid data returns error', async () => {
    getReportTypeDetails.mockReturnValue({ sourceType: 'dog', pk: 'ED123000' })
    getFromSession.mockReturnValue([{ addressLine1: 'addr1', addressLine2: 'addr2', town: 'town', postcode: 'AB1 1TT', country: 'England' }])
    const payload = {
    }

    const options = {
      method: 'POST',
      url: '/cdo/report/select-address',
      auth,
      payload
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
