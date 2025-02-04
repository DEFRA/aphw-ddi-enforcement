const { addMonths } = require('date-fns')
const {
  getElapsed, formatToDateTime, getMonthsSince, dateComponentsToString, getStatsTimestamp, getTimeInAmPm,
  getDateAsReadableString, removeIndividualDateComponents, formatToDDMMYYYY, formatToGdsShort,
  removeDateComponents, validateDate
} = require('../../../app/lib/date-helpers')

describe('date-helpers', () => {
  describe('getElapsed', () => {
    test('should handle invalid dates', () => {
      const elapsed = getElapsed(null, null)
      expect(elapsed).toEqual('00:00:00')
    })

    test('should handle zero difference', () => {
      const elapsed = getElapsed('2024-04-01T12:00:00.00000Z', '2024-04-01T12:00:00.00000Z')
      expect(elapsed).toEqual('00:00:00')
    })

    test('should handle difference when hours/mins/secs in single digits', () => {
      const elapsed = getElapsed('2024-04-01T13:02:03.00000Z', '2024-04-01T12:00:00.00000Z')
      expect(elapsed).toEqual('01:02:03')
    })

    test('should handle difference when hours/mins/secs in double digits', () => {
      const elapsed = getElapsed('2024-04-01T11:12:13.00000Z', '2024-04-01T01:00:00.00000Z')
      expect(elapsed).toEqual('10:12:13')
    })
  })

  describe('formatToDateTime', () => {
    test('should handle null dates', () => {
      const result = formatToDateTime(null)
      expect(result).toBe(null)
    })

    test('should handle undefined dates', () => {
      const result = formatToDateTime(undefined)
      expect(result).toBe(undefined)
    })

    test('should handle normal dates', () => {
      const result = formatToDateTime(new Date(2024, 5, 5, 10, 4, 1))
      expect(result).toBe('05 June 2024 10:04:01')
    })
  })

  describe('getMonthsSince', () => {
    test('should return value with "months" given over than one month', () => {
      const sinceMonth = new Date('2024-06-01')
      const date = new Date('2024-02-01')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('4 months')
    })

    test('should return value with "month" given one month', () => {
      const sinceMonth = new Date('2024-06-01')
      const date = new Date('2024-05-02')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('1 month')
    })

    test('should return Less than 1 month given less one month', () => {
      const sinceMonth = new Date('2024-06-01')
      const date = new Date('2024-05-03')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('Less than 1 month')
    })

    test('should return Less than 1 month given time is now', () => {
      const date = new Date()
      const result = getMonthsSince(date)
      expect(result).toBe('Less than 1 month')
    })

    test('should return Less than 1 month given value is in the future', () => {
      const sinceMonth = new Date('2024-03-03')
      const date = new Date('2024-03-04')
      const result = getMonthsSince(date, sinceMonth)
      expect(result).toBe('Less than 1 month')
    })
  })

  describe('dateComponentsToString', () => {
    test('should construct date from components', () => {
      const result = dateComponentsToString({ 'pre-year': 2000, 'pre-month': 5, 'pre-day': 15 }, 'pre')
      expect(result).toBe('2000-5-15')
    })

    test('should handle undefined dates', () => {
      const result = dateComponentsToString({ 'missing-year': 2000, 'missing-month': 5, 'missing-day': 15 }, 'pre')
      expect(result).toBe('undefined-undefined-undefined')
    })
  })

  describe('getTimeInAmPm', () => {
    test('should get winter time 12am GMT', () => {
      expect(getTimeInAmPm('2025-12-17T00:00:00.000Z')).toBe('12am')
    })
    test('should get winter time 12pm GMT', () => {
      expect(getTimeInAmPm('2025-12-17T12:00:00.000Z')).toBe('12pm')
    })
    test('should get winter time 7am GMT', () => {
      expect(getTimeInAmPm('2025-12-17T07:00:00.000Z')).toBe('7am')
    })
    test('should get summer time 8am BST', () => {
      expect(getTimeInAmPm('2025-07-17T07:00:00.000Z')).toBe('8am')
    })
    test('should get summer time 1pm BST', () => {
      expect(getTimeInAmPm('2025-07-17T12:00:00.000Z')).toBe('1pm')
    })
    test('should get summer time 11am BST', () => {
      expect(getTimeInAmPm('2025-07-17T10:59:59.999Z')).toBe('11am')
    })
    test('should get summer time before clocks change Oct 26 2024', () => {
      expect(getTimeInAmPm('2024-10-26T15:59:59.999Z')).toBe('4pm')
    })
    test('should get winter time after clocks change Oct 27 2024', () => {
      expect(getTimeInAmPm('2024-10-27T09:00:00.000Z')).toBe('9am')
    })
  })

  describe('getDateAsReadableString', () => {
    test('should get winter time 12am GMT', () => {
      expect(getDateAsReadableString('2025-12-17T00:00:00.000Z')).toBe('17 December 2025')
    })
    test('should get winter time 1am GMT', () => {
      expect(getDateAsReadableString('2025-12-17T01:00:00.000Z')).toBe('17 December 2025')
    })
    test('should get winter time 11pm GMT', () => {
      expect(getDateAsReadableString('2025-12-17T23:59:59.999Z')).toBe('17 December 2025')
    })
    test('should get summer time 12am BST', () => {
      expect(getDateAsReadableString('2025-07-16T23:00:00.000Z')).toBe('17 July 2025')
    })
    test('should get summer time 11pm BST', () => {
      expect(getDateAsReadableString('2025-07-17T22:59:59.999Z')).toBe('17 July 2025')
    })
    test('should get summer time 1am BST', () => {
      expect(getDateAsReadableString('2025-07-17T12:00:00.000Z')).toBe('17 July 2025')
    })
  })

  describe('getStatsTimestamp', () => {
    test('should return now', () => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date('2025-12-17T00:00:00.000Z'))
      expect(getStatsTimestamp()).toBe('12am, 17 December 2025')
      jest.useRealTimers()
    })

    test('should handle undefined values', () => {
      jest
        .useFakeTimers()
        .setSystemTime(new Date('2024-06-17T09:54:04.769Z'))
      expect(getStatsTimestamp(undefined)).toBe('10am, 17 June 2024')
      jest.useRealTimers()
    })

    test('should return the date in a readable format during winter', () => {
      const date = new Date('2025-12-17T00:00:00.000Z')
      expect(getStatsTimestamp(date)).toBe('12am, 17 December 2025')
    })

    test('should return the date in a readable format during summer', () => {
      const date = new Date('2025-06-14T00:00:00.000Z')
      expect(getStatsTimestamp(date)).toBe('1am, 14 June 2025')
    })

    test('should return the date in a readable format', () => {
      expect(getStatsTimestamp(new Date('2025-03-07T13:00:00.000Z'))).toBe('1pm, 7 March 2025')
    })

    test('should handle null values', () => {
      expect(getStatsTimestamp(null)).toBe(null)
    })
  })
  describe('removeIndividualDateComponents', () => {
    test('should remove components if exist', () => {
      const payload = { 'field1-day': '01', 'field1-month': '01', 'field1-year': '2099', anotherField: 123 }
      const res = removeIndividualDateComponents(payload)
      expect(res).toEqual({ anotherField: 123 })
    })

    test('should not remove components if dont exist', () => {
      const payload = { 'field1-dayx': '01', 'field1-monthx': '01', 'field1-yearx': '2099', anotherField: 123 }
      const res = removeIndividualDateComponents(payload)
      expect(res).toEqual({ anotherField: 123, 'field1-dayx': '01', 'field1-monthx': '01', 'field1-yearx': '2099' })
    })
  })

  describe('formatToDDMMYYYY', () => {
    test('should format date', () => {
      const res = formatToDDMMYYYY(new Date(2024, 5, 25))
      expect(res).toBe('25/06/2024')
    })
    test('should handle null', () => {
      const res = formatToDDMMYYYY(null)
      expect(res).toBe(null)
    })
    test('should handle undefined', () => {
      const res = formatToDDMMYYYY(undefined)
      expect(res).toBe(undefined)
    })
  })

  describe('formatToGdsShort', () => {
    test('should handle null dates', () => {
      expect(formatToGdsShort(null)).toBe(null)
    })

    test('should handle undefined dates', () => {
      expect(formatToGdsShort(undefined)).toBe(undefined)
    })

    test('should handle a typical date', () => {
      expect(formatToGdsShort(new Date(2001, 5, 8))).toBe('08 Jun 2001')
    })
  })

  describe('removeDateComponents', () => {
    test('should remove components', () => {
      const payload = {
        'abc-year': '2024',
        'abc-month': '10',
        'abc-day': '28',
        other: 123
      }
      removeDateComponents(payload, 'abc')
      expect(payload).toEqual({ other: 123 })
    })

    test('should leave unchanged if no components', () => {
      const payload = {
        'abc-year': '2024',
        'abc-month': '10',
        'abc-day': '28',
        other: 123
      }
      removeDateComponents(payload, 'def')
      expect(payload).toEqual({
        'abc-year': '2024',
        'abc-month': '10',
        'abc-day': '28',
        other: 123
      })
    })
  })

  const mockHelpers = {
    state: {
      path: ['dateOfBirth']
    },
    message: (a, b) => { return { error: a, elemName: b } },
    error: (a, b) => { return { error: a, elemName: b } }
  }

  const generateShiftedDate = (months) => {
    const now = new Date()
    const newDate = addMonths(now, months)
    return {
      day: `${newDate.getDate()}`,
      month: `${newDate.getMonth() + 1}`,
      year: `${newDate.getFullYear()}`
    }
  }

  describe('validateDate', () => {
    test('should handle null date', () => {
      expect(validateDate({ day: null, month: null, year: null }, mockHelpers)).toBe(null)
    })

    test('should handle valid date', () => {
      expect(validateDate({ day: '01', month: '05', year: '2024' }, mockHelpers)).toEqual(new Date(2024, 4, 1))
    })

    test('should handle incorrect year', () => {
      expect(validateDate({ day: '01', month: '05', year: '24' }, mockHelpers).error).toBe('Year must include four numbers')
    })

    test('should handle non-real date', () => {
      expect(validateDate({ day: 'xx', month: '05', year: '24' }, mockHelpers).error).toBe('Date must be a real date')
    })

    test('should handle missing elements in date', () => {
      expect(validateDate({ month: '05', year: '24' }, mockHelpers).error).toBe('Date must include a day')
    })

    test('should handle all missing elements in required date', () => {
      expect(validateDate({ }, mockHelpers, true).error).toBe('any.required')
    })

    test('should prevent future dates', () => {
      const futureDate = generateShiftedDate(1)
      expect(validateDate(futureDate, mockHelpers, false, true).error).toBe('Date must be today or in the past')
    })

    test('should prevent past dates', () => {
      const pastDate = generateShiftedDate(-1)
      expect(validateDate(pastDate, mockHelpers, false, false, true).error).toBe('Date must be today or in the future')
    })

    test('should prevent older than 15 years ago', () => {
      const veryOldDate = generateShiftedDate((-15 * 12) - 1)
      expect(validateDate(veryOldDate, mockHelpers, false, false, false, true).error).toBe('Date must be within the last 15 years')
    })
  })
})
