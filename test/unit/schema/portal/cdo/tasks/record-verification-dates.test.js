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
      taskName: 'submit-form-two'
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

  test('should validate if no microchip fields have been submitted', () => {
    const request = {
      microchipNumber: '123456789012358',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      taskName: 'submit-form-two'
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter the date the dog’s microchip number was verified, or select ‘Dog declared unfit for microchipping by vet’')
  })

  test('should validate if not valid not microchipped and neutered are sent', () => {
    const request = {
      microchipNumber: '',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      dogNotFitForMicrochip: 'Y',
      'neuteringConfirmation-day': '',
      'neuteringConfirmation-month': '',
      'neuteringConfirmation-year': '',
      dogNotNeutered: 'Y',
      taskName: 'submit-form-two'
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
      taskName: 'submit-form-two'
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter a microchip number')
  })

  test('should validate if microchip entered and dog declared unfit', () => {
    const request = {
      microchipNumber: '123456789012345',
      dogNotFitForMicrochip: 'Y',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      taskName: 'submit-form-two'
    }
    const value = validateVerificationDates(request)
    expect(value).toEqual({
      microchipNumber: '123456789012345',
      dogNotFitForMicrochip: true,
      dogNotNeutered: false,
      microchipVerification: { day: '', month: '', year: '' },
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      'neuteringConfirmation-day': 1,
      'neuteringConfirmation-month': 10,
      'neuteringConfirmation-year': 2024,
      neuteringConfirmation: expect.any(Date),
      taskName: 'submit-form-two'
    })
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
      taskName: 'submit-form-two'
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter the date the dog’s microchip number was verified, or select ‘Dog declared unfit for microchipping by vet’')
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
      taskName: 'submit-form-two'
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’')
  })

  test('should give error if invalid microchip date', () => {
    const request = {
      microchipNumber: '123456789012345',
      'microchipVerification-day': '01',
      'microchipVerification-month': 'xx',
      'microchipVerification-year': '2024',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      dogNotNeutered: 'Y',
      taskName: 'submit-form-two'
    }
    expect(() => validateVerificationDates(request)).toThrow('Enter the date the dog’s neutering was verified, or select ‘Dog aged under 16 months and not neutered’')
  })

  test('should give error if invalid neutering date', () => {
    const request = {
      microchipNumber: '123456789012345',
      'microchipVerification-day': '01',
      'microchipVerification-month': '10',
      'microchipVerification-year': '2024',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': 'yy',
      'neuteringConfirmation-year': '2024',
      dogNotNeutered: 'Y',
      taskName: 'submit-form-two'
    }
    expect(() => validateVerificationDates(request)).toThrow('"neuteringConfirmation-month" must be a number. Date must be a real date')
  })
})
