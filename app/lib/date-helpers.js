const { format } = require('date-fns')
const { formatInTimeZone } = require('date-fns-tz')

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

module.exports = {
  dateComponentsToString,
  formatToGds,
  stripTimeFromUTC,
  formatToDateTime,
  getElapsed,
  getMonthsSince,
  getStatsTimestamp,
  getTimeInAmPm,
  getDateAsReadableString,
  removeIndividualDateComponents
}
