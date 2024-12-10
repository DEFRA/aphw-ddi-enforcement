const { validateMicrochipDeadlineDates } = require('../../../../../../app/schema/portal/cdo/tasks/record-microchip-deadline')

describe('record-microchip-deadline', () => {
  test('should validate if correct values are sent', () => {
    const request = {
      microchipNumber: '123456789012358',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      'neuteringConfirmation-day': '01',
      'neuteringConfirmation-month': '10',
      'neuteringConfirmation-year': '2024',
      'microchipDeadline-day': '01',
      'microchipDeadline-month': '10',
      'microchipDeadline-year': '9999',
      taskName: 'record-microchip-deadline'
    }
    expect(validateMicrochipDeadlineDates(request)).toEqual({
      dogNotFitForMicrochip: false,
      dogNotNeutered: false,
      microchipNumber: '123456789012358',
      'microchipVerification-day': '',
      'microchipVerification-month': '',
      'microchipVerification-year': '',
      neuteringConfirmation: expect.any(Date),
      microchipDeadline: expect.any(Date),
      'neuteringConfirmation-day': 1,
      'neuteringConfirmation-month': 10,
      'neuteringConfirmation-year': 2024,
      'microchipDeadline-day': 1,
      'microchipDeadline-month': 10,
      'microchipDeadline-year': 9999,
      taskName: 'record-microchip-deadline'
    })
  })
})
