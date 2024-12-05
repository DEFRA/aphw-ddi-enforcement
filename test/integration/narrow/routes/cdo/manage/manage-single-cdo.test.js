const { auth, user } = require('../../../../../mocks/auth')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')
const { buildTaskListFromInitial, buildCdoSummary, buildTaskListFromComplete } = require('../../../../../mocks/cdo/manage/tasks/builder')

describe('Manage Cdo test', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo, getManageCdoDetails } = require('../../../../../../app/api/ddi-index-api/cdo')

  const createServer = require('../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001',
        status: 'Pre-exempt'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-01-20')
      }
    })

    getManageCdoDetails.mockResolvedValue(buildTaskListFromInitial({
      microchipNumber: '673827549000083',
      microchipNumber2: '673827549000084',
      cdoSummary: buildCdoSummary({
        exemption: {
          cdoExpiry: '2024-04-19T00:00:00.000Z'
        },
        person: {
          lastName: 'McFadyen',
          firstName: 'Garry'
        },
        dog: {
          name: 'Kilo'
        }
      })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')
    expect(document.querySelector('span.govuk-body.defra-secondary-text')).toBeNull()
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[0].textContent.trim()).toBe('Application pack')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[0].textContent.trim()).toBe('Not sent')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[1].textContent.trim()).toBe('Evidence of insurance')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[1].textContent.trim()).toBe('Not received')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[2].textContent.trim()).toBe('Microchip number')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[2].textContent.trim()).toBe('Not received')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[3].textContent.trim()).toBe('Application fee')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[3].textContent.trim()).toBe('Not received')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[4].textContent.trim()).toBe('Form 2 confirming dog microchipped and neutered')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[4].textContent.trim()).toBe('Not received')
    expect(document.querySelector('.govuk-tag').textContent.trim()).toBe('Applying for exemption')

    const [dogNameKey, ownerNameKey, microchipNumberKey, cdoExpiryKey] = document.querySelectorAll('.govuk-summary-list__key')
    const [dogName, ownerName, microchipNumber, cdoExpiry] = document.querySelectorAll('.govuk-summary-list__value')
    expect(dogNameKey.textContent.trim()).toBe('Dog name')
    expect(ownerNameKey.textContent.trim()).toBe('Owner name')
    expect(microchipNumberKey.textContent.trim()).toBe('Microchip number')
    expect(cdoExpiryKey.textContent.trim()).toBe('CDO expiry')
    expect(dogName.textContent.trim()).toBe('Kilo')
    expect(ownerName.textContent.trim()).toBe('Garry McFadyen')
    expect(microchipNumber.textContent.trim()).toBe('673827549000083673827549000084')
    expect(cdoExpiry.textContent.trim()).toBe('19 Apr 2024')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 given Failed status', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001',
        status: 'Failed'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-01-20')
      }
    })

    getManageCdoDetails.mockResolvedValue(buildTaskListFromInitial({
      microchipNumber: '673827549000083',
      microchipNumber2: '673827549000084',
      cdoSummary: buildCdoSummary({
        exemption: {
          cdoExpiry: '2024-04-19T00:00:00.000Z'
        },
        person: {
          lastName: 'McFadyen',
          firstName: 'Garry'
        },
        dog: {
          name: 'Kilo'
        }
      })
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('.govuk-tag').textContent.trim()).toBe('Failed to exempt dog')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 with completed tasks', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(buildTaskListFromComplete({}))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[0].textContent.trim()).toBe('Application pack')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[0].textContent.trim()).toBe('Received on 27 November 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[1].textContent.trim()).toBe('Evidence of insurance')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[1].textContent.trim()).toBe('Received on 27 November 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[2].textContent.trim()).toBe('Microchip number')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[2].textContent.trim()).toBe('Received on 27 November 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[3].textContent.trim()).toBe('Application fee')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[3].textContent.trim()).toBe('Received on 27 November 2024')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__name-and-hint')[4].textContent.trim()).toBe('Form 2 confirming dog microchipped and neutered')
    expect(document.querySelectorAll('ul.govuk-task-list li .govuk-task-list__status')[4].textContent.trim()).toBe('Received on 27 November 2024')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 404 when invalid index number', async () => {
    getCdo.mockResolvedValue({
      dog: {
        indexNumber: 'ED20001'
      },
      person: {
        personReference: 'P-A133-7E4C'
      },
      exemption: {
        cdoExpiry: new Date('2024-04-19')
      }
    })
    getManageCdoDetails.mockResolvedValue(null)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
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