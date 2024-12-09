jest.mock('../../../../../../app/api/ddi-index-api/cdo')
const { getCdoTaskDetails } = require('../../../../../../app/api/ddi-index-api/cdo')

jest.mock('../../../../../../app/api/ddi-index-api/insurance')
const { getCompanies } = require('../../../../../../app/api/ddi-index-api/insurance')

jest.mock('../../../../../../app/session/cdo/manage')
const { getVerificationPayload } = require('../../../../../../app/session/cdo/manage')

const { createModel, getValidation, getTaskData, getTaskDetails, getTaskDetailsByKey, verificationData } = require('../../../../../../app/routes/cdo/manage/tasks/generic-task-helper')
const { buildTaskListFromComplete, buildTaskListTasks } = require('../../../../../mocks/cdo/manage/tasks/builder')
describe('Generic Task Helper test', () => {
  describe('CreateModel', () => {
    test('handles invalid task name', () => {
      expect(() => createModel('invalid')).toThrow('Invalid task invalid when getting model')
    })

    test('includes task name and backNav in resulting model', () => {
      const data = {
        indexNumber: 'ED12345',
        task: {
          completed: false
        },
        ...buildTaskListFromComplete(),
        'microchipVerification-year': '2024',
        'microchipVerification-month': '12',
        'microchipVerification-day': '09',
        'neuteringConfirmation-year': '2024',
        'neuteringConfirmation-month': '12',
        'neuteringConfirmation-day': '09',
        'microchipDeadline-year': '2024',
        'microchipDeadline-month': '12',
        'microchipDeadline-day': '09'
      }
      const backNav = {
        backLink: '/back',
        srcHashParam: '?src=abc123'
      }
      const res = createModel('submit-form-two', data, backNav)

      expect(res.model.taskName).toBe('submit-form-two')
      expect(res.model.backLink).toBe('/back')
      expect(res.model.srcHashParam).toBe('?src=abc123')
    })

    test('passes errors', () => {
      const data = {
        indexNumber: 'ED12345',
        task: {
          completed: false
        },
        ...buildTaskListFromComplete(),
        'microchipVerification-year': '2024',
        'microchipVerification-month': '12',
        'microchipVerification-day': '09',
        'neuteringConfirmation-year': '2024',
        'neuteringConfirmation-month': '12',
        'neuteringConfirmation-day': '09',
        'microchipDeadline-year': '2024',
        'microchipDeadline-month': '12',
        'microchipDeadline-day': '09'
      }
      const backNav = {
        backLink: '/back',
        srcHashParam: '?src=abc123'
      }
      const errors = { details: [{ path: ['microchipNumber'], message: 'Microchip number must be 15 digits in length' }] }

      const res = createModel('submit-form-two', data, backNav, errors)

      expect(res.model.taskName).toBe('submit-form-two')
      expect(res.model.errors.length).not.toBe(0)
      expect(res.model.errors[0].text).toBe('Microchip number must be 15 digits in length')
    })
  })

  describe('GetValidation', () => {
    test('handles invalid task name', () => {
      expect(() => getValidation({ taskName: 'invalid' })).toThrow('Invalid task invalid when getting validation')
    })

    describe('verification dates', () => {
      test('should get correct validation for task 6 (Verification Dates)', () => {
        const payload = { taskName: 'submit-form-two', 'microchipVerification-day': '01', 'microchipVerification-month': '05', 'microchipVerification-year': '2024', 'neuteringConfirmation-day': '01', 'neuteringConfirmation-month': '05', 'neuteringConfirmation-year': '2024' }
        expect(() => getValidation(payload)).not.toThrow()
        const res = getValidation(payload)
        expect(res.taskName).toBe('submit-form-two')
      })

      test('should get correct validation for Verification Dates with optional fields', () => {
        const payload = {
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: '',
          'neuteringConfirmation-day': '',
          'neuteringConfirmation-month': '',
          'neuteringConfirmation-year': '',
          dogNotNeutered: '',
          taskName: 'submit-form-two',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }

        expect(() => getValidation(payload)).not.toThrow()
        const res = getValidation(payload)
        expect(res.taskName).toBe('submit-form-two')
      })

      test('should fail if dogNotNeutered & neuteringConfirmation set', () => {
        const payload = {
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: '',
          'neuteringConfirmation-day': '01',
          'neuteringConfirmation-month': '05',
          'neuteringConfirmation-year': '2024',
          dogNotNeutered: '',
          taskName: 'submit-form-two',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }

        expect(() => getValidation(payload)).toThrow()
      })

      test('should fail with invalid date', () => {
        const payload = {
          'microchipVerification-day': '',
          'microchipVerification-month': '',
          'microchipVerification-year': '',
          dogNotFitForMicrochip: '',
          'neuteringConfirmation-day': '01',
          'neuteringConfirmation-month': '05',
          'neuteringConfirmation-year': '2024',
          dogNotNeutered: '',
          taskName: 'submit-form-two',
          microchipVerification: { year: '', month: '', day: '' },
          neuteringConfirmation: { year: '', month: '', day: '' }
        }

        expect(() => getValidation(payload)).toThrow()
      })
    })
  })

  describe('getTaskDetails', () => {
    test('throws error if invalid task', () => {
      expect(() => getTaskDetails('invalid')).toThrow('Invalid task invalid when getting details')
    })
  })

  describe('getTaskDetailsByKey', () => {
    test('throws error if invalid task', () => {
      expect(() => getTaskDetailsByKey('invalid')).toThrow('Invalid task invalid when getting details')
    })
  })

  describe('getTaskData', () => {
    test('adds indexNumber', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        tasks: buildTaskListTasks({
          verificationDateRecorded: {
            key: 'verificationDateRecorded',
            available: true,
            completed: true,
            readonly: false,
            timestamp: '2024-11-28T00:00:00.000Z'
          }
        })
      }))
      getCompanies.mockResolvedValue([{ company: 'Company 1' }])
      const res = await getTaskData('ED123', 'submit-form-two', {}, {})
      expect(res.indexNumber).toBe('ED123')
      expect(res.task).toEqual({
        key: 'verificationDateRecorded',
        available: true,
        completed: true,
        readonly: false,
        timestamp: '2024-11-28T00:00:00.000Z'
      })
      expect(res.companies).toBeUndefined()
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from api', async () => {
      const verificationOptions = {
        dogDeclaredUnfit: true,
        allowNeuteringBypass: true,
        neuteringBypassedUnder16: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      }
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions
      }))
      const res = await getTaskData('ED123', 'submit-form-two', {}, {})

      expect(res.verificationOptions).toEqual(verificationOptions)
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from payload', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions: {
          dogDeclaredUnfit: true,
          allowNeuteringBypass: true,
          neuteringBypassedUnder16: true,
          showNeuteringBypass: true,
          allowDogDeclaredUnfit: true
        }
      }))
      const res = await getTaskData('ED123', 'submit-form-two', {}, {}, { test: true })

      expect(res.verificationOptions).toEqual({
        dogDeclaredUnfit: false,
        neuteringBypassedUnder16: false,
        allowNeuteringBypass: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      })
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from payload even if session exists', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions: {
          dogDeclaredUnfit: true,
          allowNeuteringBypass: true,
          neuteringBypassedUnder16: true,
          showNeuteringBypass: true,
          allowDogDeclaredUnfit: true
        }
      }))
      getVerificationPayload.mockReturnValue({
        neuteringConfirmation: { year: '', month: '', day: '' },
        microchipVerification: { year: '', month: '', day: '' },
        dogNotFitForMicrochip: true,
        dogNotNeutered: true
      })
      const res = await getTaskData('ED123', 'submit-form-two', {}, {}, { test: true })

      expect(res.verificationOptions).toEqual({
        dogDeclaredUnfit: false,
        neuteringBypassedUnder16: false,
        allowNeuteringBypass: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      })
    })

    test('should set dogDeclaredUnfit and neuteringBypassedUnder16 from session if no payload exists', async () => {
      getCdoTaskDetails.mockResolvedValue(buildTaskListFromComplete({
        verificationOptions: {
          dogDeclaredUnfit: false,
          neuteringBypassedUnder16: false,
          allowNeuteringBypass: true,
          showNeuteringBypass: true,
          allowDogDeclaredUnfit: true
        }
      }))
      getVerificationPayload.mockReturnValue({
        neuteringConfirmation: { year: '', month: '', day: '' },
        microchipVerification: { year: '', month: '', day: '' },
        dogNotFitForMicrochip: true,
        dogNotNeutered: true
      })
      const res = await getTaskData('ED123', 'submit-form-two', {}, {})

      expect(res.verificationOptions).toEqual({
        dogDeclaredUnfit: true,
        neuteringBypassedUnder16: true,
        allowNeuteringBypass: true,
        showNeuteringBypass: true,
        allowDogDeclaredUnfit: true
      })
    })
  })

  describe('verificationData', () => {
    test('should use defaults if missing', () => {
      getVerificationPayload.mockReturnValue({
        dogNotFitForMicrochip: undefined,
        dogNotNeutered: undefined,
        neuteringConfirmation: new Date('2024-11-12')
      })

      const data = verificationData({
        verificationOptions: {
          dogNotFitForMicrochip: false,
          dogNotNeutered: false
        }
      }, {}, {
        neuteringConfirmation: new Date('2024-11-12')
      })

      expect(data).toEqual({
        neuteringConfirmation: new Date('2024-11-12T00:00:00.000Z'),
        'neuteringConfirmation-day': undefined,
        'neuteringConfirmation-month': undefined,
        'neuteringConfirmation-year': undefined,
        verificationOptions: {
          dogDeclaredUnfit: false,
          dogNotFitForMicrochip: false,
          dogNotNeutered: false,
          neuteringBypassedUnder16: false
        }
      })
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
  })
})
