const { auth, user } = require('../../../../mocks/auth')
const FormData = require('form-data')
const { doSearch } = require('../../../../../app/api/ddi-index-api/search')
const { JSDOM } = require('jsdom')
const { getRedirectForUserAccess } = require('../../../../../app/lib/route-helpers')
jest.mock('../../../../../app/lib/route-helpers')
jest.mock('../../../../../app/api/ddi-index-api/search')
jest.mock('../../../../../app/api/ddi-index-api/user')

describe('SearchBasic test', () => {
  jest.mock('../../../../../app/auth')
  const mockAuth = require('../../../../../app/auth')

  const createServer = require('../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/search/basic route returns 200 if access is ok', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
    const options = {
      method: 'GET',
      url: '/cdo/search/basic',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = new JSDOM(response.payload).window
    expect(document.querySelector('#main-content').textContent).toContain('Find registered dangerous dogs, or dog owners, by using one or more of these terms:')
  })

  test('GET /cdo/search/basic route returns 302 if not auth', async () => {
    const fd = new FormData()

    const options = {
      method: 'GET',
      url: '/cdo/search/basic',
      headers: fd.getHeaders(),
      payload: fd.getBuffer()
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
  })

  test('GET /cdo/search/basic with valid data returns 200', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
    doSearch.mockResolvedValue({ results: [], totalFound: 0 })

    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=term1&searchType=dog',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)
  })

  test('GET /cdo/search/basic dog record search with valid data and empty Dog name and Microchip number returns 200', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
    doSearch.mockResolvedValue(
      {
        results: [
          {
            address: '47 PARK STREET, LONDON, W1K 7EB',
            dogName: '',
            dogIndex: 'ED300242',
            lastName: 'Ralph',
            dogStatus: 'Pre-exempt',
            firstName: 'Wreck it',
            personReference: 'P-4813-BF4F',
            dogId: 300242,
            personId: 183,
            distance: 8,
            rank: 0.0607927
          }
        ],
        totalFound: 1
      })

    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=ED300242&searchType=dog',
      auth
    }

    const response = await server.inject(options)
    const { document } = new JSDOM(response.payload).window

    expect(response.statusCode).toBe(200)
    const [statusResult, dogNameResult, ownerNameResult, ownerAddressResult, microchipNumberResult] = document.querySelectorAll('.govuk-summary-list__value')
    expect(statusResult.textContent.trim()).toBe('Applying for exemption')
    expect(dogNameResult.textContent.trim()).toBe('Not entered')
    expect(ownerNameResult.textContent.trim()).toBe('Wreck it Ralph')
    expect(ownerAddressResult.textContent.trim()).toBe('47 PARK STREET, LONDON, W1K 7EB')
    expect(microchipNumberResult.textContent.trim()).toBe('Not entered')
    expect(document.querySelector('#main-content')).not.toContain('Find exempt dangerous dogs or dog owners by searching with one or more of these terms')
  })

  test('GET /cdo/search/basic with invalid data returns error', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('GET cdo/search/basic with invalid data returns error - invalid chars', async () => {
    getRedirectForUserAccess.mockResolvedValue(null)
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=**abc&&',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(400)
  })

  test('GET cdo/search/basic forwards to licence - if not yet accepted', async () => {
    getRedirectForUserAccess.mockResolvedValue('/secure-access-licence')
    const options = {
      method: 'GET',
      url: '/cdo/search/basic?searchTerms=**abc&&',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(302)
    expect(response.headers.location).toBe('/secure-access-licence')
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
