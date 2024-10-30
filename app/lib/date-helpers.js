const { UTCDate } = require('@date-fns/utc')
const { formatInTimeZone } = require('date-fns-tz')
const { parse, isValid, isFuture, isToday, format, differenceInYears } = require('date-fns')

const validDateFormats = [
  'yyyy-MM-dd',
  'yyyy-M-d'
]

const parseDate = (value) => {
  for (const fmt of validDateFormats) {
    const date = parse(value, fmt, new UTCDate())

    if (isValid(date)) {
      return date
    }
  }

  return null
}

/**
 * @param {Date} value
 * @returns {string}
 */
const stripTimeFromUTC = (value) => {
  return format(value, 'yyyy-MM-dd')
}

const dateComponentsToString = (payload, prefix) => {
  const year = payload[prefix + '-year']
  const month = payload[prefix + '-month']
  const day = payload[prefix + '-day']

  return `${year}-${month}-${day}`
}

const formatToGds = date => {
  if (date === null || date === undefined) {
    return date
  }

  return format(new Date(date), 'dd MMMM yyyy')
}

const formatToDDMMYYYY = date => {
  if (date === null || date === undefined) {
    return date
  }

  return format(new Date(date), 'dd/MM/yyyy')
}

const formatToDateTime = date => {
  if (date === null || date === undefined) {
    return date
  }

  return format(new Date(date), 'dd MMMM yyyy hh:mm:ss')
}

const getElapsed = (end, start) => {
  const endTime = new Date(end)
  const startTime = new Date(start)

  let diff = Math.abs(endTime - startTime) / 1000

  const hours = Math.floor(diff / 3600) % 24
  diff -= hours * 3600

  const minutes = Math.floor(diff / 60) % 60
  diff -= minutes * 60

  const seconds = Math.floor(diff % 60)

  return `${leftPadTo2(hours)}:${leftPadTo2(minutes)}:${leftPadTo2(seconds)}`
}

const leftPadTo2 = val => {
  return val < 10 ? `0${val}` : `${val}`
}

const getMonthsSince = (date, dateFromOptional) => {
  const dateFrom = dateFromOptional || new Date()
  const day = 24 * 60 * 60 * 1000
  const difference = dateFrom - date
  const differenceMonths = Math.floor(difference / day / 30)

  if (differenceMonths === 1) {
    return `${differenceMonths} month`
  } else if (differenceMonths > 1) {
    return `${differenceMonths} months`
  }

  return 'Less than 1 month'
}

/**
 * @param {string} dateStr
 * @return {string}
 */
const getTimeInAmPm = (dateStr) => {
  return formatInTimeZone(dateStr, 'Europe/London', 'ha').toLowerCase()
}

const getDateAsReadableString = (dateStr) => {
  return formatInTimeZone(dateStr, 'Europe/London', 'd LLLL yyyy')
}

/**
 * @param {Date} date
 * @return {string|Date}
 */
const getStatsTimestamp = (date = new Date()) => {
  if (date === null) {
    return date
  }
  return `${getTimeInAmPm(date.toISOString())}, ${getDateAsReadableString(date.toISOString())}`
}

const removeIndividualDateComponents = (payload) => {
  const keys = Object.keys(payload)
  keys.forEach(key => {
    if (key.endsWith('-day') || key.endsWith('-month') || key.endsWith('-year')) {
      delete payload[key]
    }
  })
  return payload
}

const getDateComponents = (payload, prefix) => {
  const year = payload[prefix + '-year']
  const month = payload[prefix + '-month']
  const day = payload[prefix + '-day']

  return { year, month, day }
}

const validateDate = (value, helpers, required = false, preventFutureDates = false, preventPastDates = false, preventOlderThanFifteenYearsAgo = false) => {
  const { day, month, year } = value
  const dateComponents = { day, month, year }
  const invalidComponents = []

  const elementPath = helpers.state.path[0]

  for (const key in dateComponents) {
    if (!dateComponents[key]) {
      invalidComponents.push(key)
    }
  }

  if (invalidComponents.length === 0) {
    const dateString = `${year}-${month}-${day}`
    const date = parseDate(dateString)

    if (!date) {
      return helpers.message('Date must be a real date', { path: [elementPath, ['day', 'month', 'year']] })
    }

    if (year.length !== 4) {
      return helpers.message('Year must include four numbers', { path: [elementPath, ['year']] })
    }

    if (preventFutureDates && isFuture(date)) {
      return helpers.message('Date must be today or in the past', { path: [elementPath, ['day', 'month', 'year']] })
    }

    if (preventPastDates && !isFuture(date) && !isToday(date)) {
      return helpers.message('Date must be today or in the future', { path: [elementPath, ['day', 'month', 'year']] })
    }

    if (preventOlderThanFifteenYearsAgo && differenceInYears(new Date(), date) >= 15) {
      return helpers.message('Date must less than 15 years ago', { path: [elementPath, ['day', 'month', 'year']] })
    }

    return date
  }

  if (invalidComponents.length === 3) {
    if (required) {
      return helpers.error('any.required', { path: [elementPath, ['day']] })
    }

    return null
  }

  const errorMessage = `Date must include a ${invalidComponents.join(' and ')}`

  return helpers.message(errorMessage, { path: [elementPath, invalidComponents] })
}

module.exports = {
  dateComponentsToString,
  formatToGds,
  formatToDDMMYYYY,
  stripTimeFromUTC,
  formatToDateTime,
  getElapsed,
  getMonthsSince,
  getStatsTimestamp,
  getTimeInAmPm,
  getDateAsReadableString,
  removeIndividualDateComponents,
  getDateComponents,
  validateDate
}
