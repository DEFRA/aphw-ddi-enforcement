const FormData = require('form-data')
const { auth, user, userWithDisplayname } = require('../../../../../../mocks/auth')
jest.mock('../../../../../../../app/session/session-wrapper')
const { setInSession } = require('../../../../../../../app/session/session-wrapper')
const { JSDOM } = require('jsdom')
jest.mock('../../../../../../../app/api/ddi-index-api/search')
const { buildTaskListFromInitial } = require('../../../../../../mocks/cdo/manage/tasks/builder')
const { ApiErrorFailure } = require('../../../../../../../app/errors/api-error-failure')

describe('Generic Task test', () => {
  jest.mock('../../../../../../../app/auth')
  const mockAuth = require('../../../../../../../app/auth')

  jest.mock('../../../../../../../app/api/ddi-index-api/cdo')
  const { getCdoTaskDetails, getCdo, saveCdoTaskDetails } = require('../../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../../app/api/ddi-index-api/insurance')

  jest.mock('../../../../../../../app/session/cdo/manage')
  const { setVerificationPayload, clearVerificationPayload } = require('../../../../../../../app/session/cdo/manage')

  const createServer = require('../../../../../../../app/server')
  let server

  setInSession.mockReturnValue()

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/manage/task/submit-form-two/ED20001', () => {
    test('GET /cdo/manage/task/submit-form-two/ED20001 route returns 200', async () => {
      const microchipNumber = '123456789012345'
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial({
        microchipNumber
      }))
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/submit-form-two/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(200)

      const { document } = (new JSDOM(response.payload)).window
      expect(document.querySelector('form span').textContent.trim()).toBe('Dog ED20001')
      expect(document.querySelector('#microchipNumber').getAttribute('value')).toBe(microchipNumber)
      expect(document.querySelector('h1.govuk-fieldset__heading').textContent.trim()).toBe('Confirm microchip and neutering details')
      expect(document.querySelectorAll('.govuk-label--s')[0].textContent.trim()).toBe('Microchip number')
      expect(document.querySelectorAll('.govuk-fieldset__legend--s')[0].textContent.trim()).toBe('When was the dog\'s microchip number verified?')
      expect(document.querySelectorAll('.govuk-fieldset__legend--s')[1].textContent.trim()).toBe('When was the dog\'s neutering verified?')
      expect(document.querySelectorAll('button')[4].textContent.trim()).toBe('Save and continue')
      expect(document.querySelector('.govuk-fieldset').textContent.trim()).toContain('Dog aged under 16 months and not neutered')
      expect(document.querySelector('.govuk-fieldset').textContent.trim()).toContain('Dog declared unfit for microchipping by vet')
    })

    // test('GET /cdo/manage/task/submit-form-two/ED20001 route shows 6th Si rules if 2015 Dog is under 16 months', async () => {
    //   getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
    //     tasks: buildTaskListTasksFromComplete({
    //       verificationDateRecorded: buildTask({
    //         key: 'verificationDateRecorded',
    //         available: true,
    //         completed: false,
    //         readonly: false
    //       }),
    //       certificateIssued: buildTask({
    //         key: 'certificateIssued',
    //         available: false,
    //         completed: false,
    //         readonly: false
    //       })
    //     }),
    //     verificationOptions: buildVerificationOptions({
    //       allowDogDeclaredUnfit: true,
    //       allowNeuteringBypass: true,
    //       showNeuteringBypass: true
    //     })
    //   }))
    //   getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
    //
    //   const options = {
    //     method: 'GET',
    //     url: '/cdo/manage/task/submit-form-two/ED20001',
    //     auth
    //   }
    //
    //   const response = await server.inject(options)
    //   expect(response.statusCode).toBe(200)
    //
    //   const { document } = (new JSDOM(response.payload)).window
    //   const fieldsetContent = document.querySelector('.govuk-fieldset').textContent.trim()
    //   expect(fieldsetContent).toContain('Dog aged under 16 months and not neutered')
    //   expect(fieldsetContent).toContain('Dog declared unfit for microchipping by vet')
    //   expect(fieldsetContent).not.toContain('Dog not neutered as under 16 months old')
    //   expect(clearVerificationPayload).not.toHaveBeenCalled()
    // })
    //
    // test('GET /cdo/manage/task/submit-form-two/ED20001 with clear should redirect', async () => {
    //   getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
    //
    //   const options = {
    //     method: 'GET',
    //     url: '/cdo/manage/task/submit-form-two/ED20001?clear=true',
    //     auth
    //   }
    //
    //   const response = await server.inject(options)
    //   expect(response.statusCode).toBe(302)
    // })
    //
    // test('GET /cdo/manage/task/submit-form-two/ED20001 route shows 6th Si rules if no Dog DOB', async () => {
    //   getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
    //     tasks: buildTaskListTasksFromComplete({
    //       verificationDateRecorded: buildTask({
    //         key: 'verificationDateRecorded',
    //         available: true,
    //         completed: false,
    //         readonly: false
    //       }),
    //       certificateIssued: buildTask({
    //         key: 'certificateIssued',
    //         available: false,
    //         completed: false,
    //         readonly: false
    //       })
    //     }),
    //     verificationOptions: buildVerificationOptions({
    //       allowDogDeclaredUnfit: true,
    //       allowNeuteringBypass: false,
    //       showNeuteringBypass: true
    //     })
    //   }))
    //   getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
    //
    //   const options = {
    //     method: 'GET',
    //     url: '/cdo/manage/task/submit-form-two/ED20001',
    //     auth
    //   }
    //
    //   const response = await server.inject(options)
    //   expect(response.statusCode).toBe(200)
    //
    //   const { document } = (new JSDOM(response.payload)).window
    //   const fieldsetContent = document.querySelector('.govuk-fieldset').textContent.trim()
    //   expect(fieldsetContent).not.toContain('Dog aged under 16 months and not neutered')
    //   expect(fieldsetContent).toContain('Dog declared unfit for microchipping by vet')
    //   expect(fieldsetContent).toContain('Dog not neutered as under 16 months old')
    // })
  })

  describe('GET /cdo/manage/task/unknown/ED20001', () => {
    test('GET /cdo/manage/task/send-application-pack/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test(' GET /cdo/manage/task/send-application-pack/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-application-pack/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
    test(' GET /cdo/manage/task/record-insurance-details/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-insurance-details/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
    test(' GET /cdo/manage/task/record-microchip-number/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-microchip-number/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
    test(' GET /cdo/manage/task/record-application-fee/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-application-fee/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
    test(' GET /cdo/manage/task/send-form2/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/send-form2/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
    test(' GET /cdo/manage/task/record-microchip-deadline/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/record-microchip-deadline/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
    test(' GET /cdo/manage/task/certificate-issued/ED20001 route returns 404', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'GET',
        url: '/cdo/manage/task/certificate-issued/ED20001',
        auth
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })
  })

  describe('POST /cdo/manage/task/submit-form-two/ED20001', () => {
    test('returns 302 if not auth', async () => {
      const fd = new FormData()

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/submit-form-two/ED20001',
        headers: fd.getHeaders(),
        payload: fd.getBuffer()
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
    })

    test('returns 302 given microchip call', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
      getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })

      const options = {
        method: 'POST',
        url: '/cdo/manage/task/submit-form-two/ED20001',
        auth,
        payload: {
          microchipNumber: '123456789012358',
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: true,
          'neuteringConfirmation-day': '',
          'neuteringConfirmation-month': '',
          'neuteringConfirmation-year': '',
          dogNotNeutered: true,
          taskName: 'submit-form-two',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(setVerificationPayload).toHaveBeenCalledWith(expect.anything(), {
        microchipNumber: '123456789012358',
        dogNotFitForMicrochip: true,
        dogNotNeutered: true,
        taskName: 'submit-form-two',
        microchipVerification: { year: '', month: '', day: '' },
        neuteringConfirmation: { year: '', month: '', day: '' },
        'neuteringConfirmation-day': '',
        'neuteringConfirmation-month': '',
        'neuteringConfirmation-year': '',
        'microchipVerification-day': '',
        'microchipVerification-month': '',
        'microchipVerification-year': ''
      })
    })

    test('fails validation if invalid payload', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/submit-form-two/ED20001',
        auth,
        payload: {
          taskName: 'submit-form-two'
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('saves if valid payload', async () => {
      saveCdoTaskDetails.mockResolvedValue()
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/submit-form-two/ED20001',
        auth,
        payload: {
          microchipNumber: '123456789012358',
          'microchipVerification-day': '01',
          'microchipVerification-month': '10',
          'microchipVerification-year': '2024',
          dogNotFitForMicrochip: false,
          'neuteringConfirmation-day': '01',
          'neuteringConfirmation-month': '10',
          'neuteringConfirmation-year': '2024',
          dogNotNeutered: false,
          taskName: 'submit-form-two',
          microchipVerification: { year: '01', month: '10', day: '2024' },
          neuteringConfirmation: { year: '01', month: '10', day: '2024' }
        }
      }

      const response = await server.inject(options)
      expect(response.statusCode).toBe(302)
      expect(saveCdoTaskDetails).toHaveBeenCalledWith('ED20001', 'submitFormTwo', {
        dogNotFitForMicrochip: false,
        dogNotNeutered: false,
        microchipNumber: '123456789012358',
        microchipVerification: new Date('2024-09-30T23:00:00.000Z'),
        'microchipVerification-day': 1,
        'microchipVerification-month': 10,
        'microchipVerification-year': 2024,
        neuteringConfirmation: new Date('2024-09-30T23:00:00.000Z'),
        'neuteringConfirmation-day': 1,
        'neuteringConfirmation-month': 10,
        'neuteringConfirmation-year': 2024,
        taskName: 'submit-form-two'
      }, expect.anything())
    })

    test('handles boom from API', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/submit-form-two/ED20001',
        auth,
        payload: {
          microchipNumber: '123456789012358',
          'microchipVerification-day': '01',
          'microchipVerification-month': '10',
          'microchipVerification-year': '2024',
          dogNotFitForMicrochip: false,
          'neuteringConfirmation-day': '01',
          'neuteringConfirmation-month': '10',
          'neuteringConfirmation-year': '2024',
          dogNotNeutered: false,
          taskName: 'submit-form-two',
          microchipVerification: { year: '01', month: '10', day: '2024' },
          neuteringConfirmation: { year: '01', month: '10', day: '2024' }
        }
      }
      saveCdoTaskDetails.mockImplementation(() => {
        throw new ApiErrorFailure('dummy error', { payload: { microchipNumber: '12345', microchipNumbers: [] } })
      })
      const response = await server.inject(options)
      expect(response.statusCode).toBe(400)
    })

    test('handles non-ApiErrorFailure boom from API', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/manage/task/process-application-pack/ED20001',
        auth,
        payload: { taskName: 'send-application-pack', taskDone: 'Y' }
      }
      saveCdoTaskDetails.mockImplementation(() => {
        throw new Error('dummy error')
      })
      const response = await server.inject(options)
      expect(response.statusCode).toBe(500)
    })
  })

  // describe('POST /cdo/manage/task/record-microchip-deadline/ED20001', () => {
  //   test('POST /cdo/manage/task/submit-form-two/ED20001 route returns 302 given microchip call', async () => {
  //     getCdoTaskDetails.mockResolvedValue(buildTaskListFromInitial())
  //     getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
  //     saveCdoTaskDetails.mockResolvedValue({})
  //
  //     const options = {
  //       method: 'POST',
  //       url: '/cdo/manage/task/record-microchip-deadline/ED20001',
  //       auth,
  //       payload: {
  //         'microchipDeadline-day': '27',
  //         'microchipDeadline-month': '12',
  //         'microchipDeadline-year': '2024',
  //         taskName: 'record-microchip-deadline',
  //         dogNotFitForMicrochip: '',
  //         dogNotNeutered: '',
  //         'microchipVerification-day': '',
  //         'microchipVerification-month': '',
  //         'microchipVerification-year': '',
  //         'neuteringConfirmation-day': '',
  //         'neuteringConfirmation-month': '',
  //         'neuteringConfirmation-year': '',
  //         microchipDeadline: '2024-12-27T00:00:00.000Z'
  //       }
  //     }
  //
  //     const response = await server.inject(options)
  //     expect(response.statusCode).toBe(302)
  //     expect(clearVerificationPayload).toHaveBeenCalled()
  //   })
  // })
  //
  // describe('GET /cdo/manage/task/record-microchip-deadline', () => {
  //   test('saves if valid payload', async () => {
  //     getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
  //       microchipDeadline: '2025-11-29T00:00:00.000Z'
  //     }))
  //     getCdo.mockResolvedValue({ dog: { status: 'Pre-exempt' } })
  //     getVerificationPayload.mockReturnValue(buildVerificationPayload({
  //       neuteringConfirmation: { year: '2026', month: '01', day: '01' },
  //       microchipVerification: { year: '', month: '', day: '' },
  //       dogNotFitForMicrochip: true,
  //       dogNotNeutered: false
  //     }))
  //
  //     const options = {
  //       method: 'GET',
  //       url: '/cdo/manage/task/record-microchip-deadline/ED20001',
  //       auth
  //     }
  //
  //     const response = await server.inject(options)
  //     expect(response.statusCode).toBe(200)
  //     const { document } = (new JSDOM(response.payload)).window
  //     expect(document.querySelector('#main-content .govuk-fieldset__heading').textContent.trim()).toBe('When will the dog be fit to be microchipped?')
  //     expect(document.querySelector('#main-content .govuk-hint').textContent.trim()).toBe('Enter the date provided by the vet.')
  //     expect(document.querySelector('#main-content .govuk-button').textContent.trim()).toBe('Save and continue')
  //   })
  // })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
