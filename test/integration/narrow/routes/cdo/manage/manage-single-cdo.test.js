const { auth, user } = require('../../../../../mocks/auth')
jest.mock('../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../app/api/ddi-index-api/search')
const {
  buildTaskListFromInitial, buildCdoSummary, buildTaskListFromComplete, buildTaskListTasksFromComplete,
  buildTask
} = require('../../../../../mocks/cdo/manage/tasks/builder')
const { someTasksCompletedButNotYetAvailable } = require('../../../../../mocks/cdo/manage/cdo')

const ordering = [
  'applicationPack',
  'evidenceOfInsurance',
  'microchipNumber',
  'applicationFee',
  'form2',
  'certificateOfExemption'
]

const progressSteps = {
  applicationPack: ordering.indexOf('applicationPack'),
  evidenceOfInsurance: ordering.indexOf('evidenceOfInsurance'),
  microchipNumber: ordering.indexOf('microchipNumber'),
  applicationFee: ordering.indexOf('applicationFee'),
  form2: ordering.indexOf('form2'),
  certificateOfExemption: ordering.indexOf('certificateOfExemption')
}

const findProgressStepName = (document, key) => document.querySelectorAll('.cdo-progress-summary-list .govuk-summary-list__key')[key].textContent.trim()
const findProgressStepStatus = (document, key) => document.querySelectorAll('.cdo-progress-summary-list .govuk-summary-list__value')[key].textContent.trim()

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
    expect(findProgressStepName(document, progressSteps.applicationPack)).toBe('Application pack')
    expect(findProgressStepStatus(document, progressSteps.applicationPack)).toBe('Not sent')
    expect(findProgressStepName(document, progressSteps.evidenceOfInsurance)).toBe('Evidence of insurance')
    expect(findProgressStepStatus(document, progressSteps.evidenceOfInsurance)).toBe('Not received')
    expect(findProgressStepName(document, progressSteps.microchipNumber)).toBe('Microchip number')
    expect(findProgressStepStatus(document, progressSteps.microchipNumber)).toBe('Not received')
    expect(findProgressStepName(document, progressSteps.applicationFee)).toBe('Application fee')
    expect(findProgressStepStatus(document, progressSteps.applicationFee)).toBe('Not received')
    expect(findProgressStepName(document, progressSteps.form2)).toBe('Form 2 confirming dog microchipped and neutered')
    expect(findProgressStepStatus(document, progressSteps.form2)).toBe('Submit Form 2')
    expect(findProgressStepName(document, progressSteps.certificateOfExemption)).toBe('Certificate of exemption')
    expect(findProgressStepStatus(document, progressSteps.certificateOfExemption)).toBe('Not sent')

    expect(document.querySelectorAll('.govuk-tag')[1].textContent.trim()).toBe('Applying for exemption')

    const [dogNameKey, ownerNameKey, microchipNumberKey, cdoExpiryKey] = document.querySelectorAll('.govuk-summary-list__key')
    const [dogName, ownerName, microchipNumber, cdoExpiry] = document.querySelectorAll('.govuk-summary-list__value')
    expect(dogNameKey.textContent.trim()).toBe('Dog name')
    expect(ownerNameKey.textContent.trim()).toBe('Owner name')
    expect(microchipNumberKey.textContent.trim()).toBe('Microchip number')
    expect(cdoExpiryKey.textContent.trim()).toBe('CDO expiry')
    expect(dogName.textContent.trim()).toBe('Kilo')
    expect(ownerName.textContent.trim()).toBe('Garry McFadyen')
    expect(microchipNumber.textContent.trim()).toBe('673827549000083673827549000084')
    expect(cdoExpiry.textContent.trim()).toBe('19 April 2024')
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
    expect(document.querySelectorAll('.govuk-tag')[1].textContent.trim()).toBe('Failed to exempt dog')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 with completed tasks overriding "Cannot start yet"', async () => {
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
    getManageCdoDetails.mockResolvedValue(someTasksCompletedButNotYetAvailable)

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(document.querySelector('h1.govuk-heading-xl').textContent.trim()).toBe('Dog ED20001')
    const [dogName, ownerName, microchipNumber, cdoExpiry] = document.querySelectorAll('.govuk-summary-list__value')
    expect(dogName.textContent.trim()).toBe('Not received')
    expect(ownerName.textContent.trim()).toBe('Not received')
    expect(microchipNumber.textContent.trim()).toBe('Not received')
    expect(cdoExpiry.textContent.trim()).toBe('19 April 2024')

    expect(findProgressStepStatus(document, progressSteps.applicationPack)).toBe('Sent')
    expect(findProgressStepStatus(document, progressSteps.evidenceOfInsurance)).toBe('Received')
    expect(findProgressStepStatus(document, progressSteps.microchipNumber)).toBe('Not received')
    expect(findProgressStepStatus(document, progressSteps.applicationFee)).toBe('Received on 02 March 2024')
    expect(findProgressStepStatus(document, progressSteps.form2)).toBe('Submit Form 2')
    expect(findProgressStepStatus(document, progressSteps.certificateOfExemption)).toBe('Not sent')
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
    expect(findProgressStepStatus(document, progressSteps.applicationPack)).toBe('Sent on 27 November 2024')
    expect(findProgressStepStatus(document, progressSteps.evidenceOfInsurance)).toBe('Received on 27 November 2024')
    expect(findProgressStepStatus(document, progressSteps.microchipNumber)).toBe('Received on 27 November 2024')
    expect(findProgressStepStatus(document, progressSteps.applicationFee)).toBe('Received on 27 November 2024')
    expect(findProgressStepStatus(document, progressSteps.form2)).toBe('Received on 28 November 2024')
    expect(findProgressStepStatus(document, progressSteps.certificateOfExemption)).toBe('Not sent')
  })

  test('GET /cdo/manage/cdo/ED123 route returns 200 with submitted form2', async () => {
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
    getManageCdoDetails.mockResolvedValue(buildTaskListFromComplete({
      tasks: buildTaskListTasksFromComplete({
        verificationDateRecorded: buildTask({
          key: 'verificationDateRecorded',
          available: true
        }),
        certificateIssued: buildTask({
          key: 'certificateIssued'
        })
      }),
      form2Submitted: '2024-11-29T00:00:00.000Z'
    }))

    const options = {
      method: 'GET',
      url: '/cdo/manage/cdo/ED123',
      auth
    }

    const response = await server.inject(options)
    expect(response.statusCode).toBe(200)

    const { document } = (new JSDOM(response.payload)).window
    expect(findProgressStepStatus(document, progressSteps.form2)).toBe('Received on 29 November 2024')
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
