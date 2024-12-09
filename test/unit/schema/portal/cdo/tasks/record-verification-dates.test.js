const { validateVerificationDates } = require('../../../../../../app/schema/portal/cdo/tasks/record-verification-dates')

describe('record-verifications-dates', () => {
  test('should validate if correct values are sent', () => {
    const request = {
      microchipNumber: '123456789012358',
      'microchipVerification-day': '01',
      'microchipVerification-month': '10',
      'microchipVerification-year': '2024',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      taskName: 'submit-form-two',
      microchipVerification: { year: '01', month: '10', day: '2024' },
      neuteringConfirmation: { year: '01', month: '10', day: '2024' }
    }
    expect(validateVerificationDates(request)).toEqual({
      dogNotFitForMicrochip: false,
      dogNotNeutered: false,
      microchipNumber: '123456789012358',
      microchipVerification: expect.any(Date),
      'microchipVerification-day': 1,
      'microchipVerification-month': 10,
      'microchipVerification-year': 2024,
      neuteringConfirmation: expect.any(Date),
      'neuteringConfirmation-day': 1,
      'neuteringConfirmation-month': 10,
      'neuteringConfirmation-year': 2024,
      taskName: 'submit-form-two'
    })
  })

  test('should validate if not valid not microchipped and neutered are sent', () => {
    const request = {
      microchipNumber: '',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      // dogNotFitForMicrochip: 'Y',
      dogNotFitForMicrochip: true,
      'neuteringConfirmation-day': '',
      'neuteringConfirmation-month': '',
      'neuteringConfirmation-year': '',
      // dogNotNeutered: 'Y',
      dogNotNeutered: true,
      taskName: 'submit-form-two',
      microchipVerification: { year: '', month: '', day: '' },
      neuteringConfirmation: { year: '', month: '', day: '' }
    }

    expect(validateVerificationDates(request)).toEqual({
      dogNotFitForMicrochip: true,
      dogNotNeutered: true,
      microchipNumber: '',
      microchipVerification: { year: '', month: '', day: '' },
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      neuteringConfirmation: { year: '', month: '', day: '' },
      'neuteringConfirmation-day': '',
      'neuteringConfirmation-month': '',
      'neuteringConfirmation-year': '',
      taskName: 'submit-form-two'
    })
  })

  test('should not validate if microchip date entered but no microchip', () => {
    const request = {
      microchipNumber: '',
      'microchipVerification-day': '01',
      'microchipVerification-month': '10',
      'microchipVerification-year': '2024',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      taskName: 'submit-form-two',
      microchipVerification: { year: '01', month: '10', day: '2024' },
      neuteringConfirmation: { year: '01', month: '10', day: '2024' }
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter a microchip number')
  })

  test('should not validate if both date entered and tick box selected for microchipping', () => {
    const request = {
      microchipNumber: '',
      dogNotFitForMicrochip: 'Y',
      'microchipVerification-day': '01',
      'microchipVerification-month': '10',
      'microchipVerification-year': '2024',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      taskName: 'submit-form-two',
      microchipVerification: { year: '01', month: '10', day: '2024' },
      neuteringConfirmation: { year: '01', month: '10', day: '2024' }
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter the date the dog’s microchip number was verified, or select ‘Dog unfit for a microchip’')
  })

  test('should not validate if both date entered and tick box selected for neutering', () => {
    const request = {
      microchipNumber: '123456789012345',
      'microchipVerification-day': '01',
      'microchipVerification-month': '10',
      'microchipVerification-year': '2024',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      dogNotNeutered: 'Y',
      taskName: 'submit-form-two',
      microchipVerification: { year: '01', month: '10', day: '2024' },
      neuteringConfirmation: { year: '01', month: '10', day: '2024' }
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’')
  })
})
