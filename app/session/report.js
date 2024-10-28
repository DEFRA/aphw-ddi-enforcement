const { keys } = require('../constants/cdo/report')

const set = (request, entryKey, key, value) => {
  const entryValue = request.yar?.get(entryKey) || {}
  entryValue[key] = typeof (value) === 'string' ? value.trim() : value
  request.yar.set(entryKey, entryValue)
}

const get = (request, entryKey, key) => {
  return key ? request.yar?.get(entryKey)?.[key] : request.yar?.get(entryKey)
}

/**
 * @param request
 * @returns {ReportType}
 */
const getReportTypeDetails = (request) => {
  return get(request, keys.entry, keys.reportType) || null
}

const setReportTypeDetails = (request, value) => {
  set(request, keys.entry, keys.reportType, value)
}

/**
 * @param request
 * @returns {Address[]}
 */
const getAddresses = (request) => {
  return get(request, keys.entry, keys.addresses) || []
}

const setAddresses = (request, value) => {
  set(request, keys.entry, keys.addresses, value)
}

const clearReportSession = request => {
  setReportTypeDetails(request, null)
  setAddresses(request, null)
}

module.exports = {
  getReportTypeDetails,
  setReportTypeDetails,
  getAddresses,
  setAddresses,
  clearReportSession
}
