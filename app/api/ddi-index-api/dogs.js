const { get } = require('./base')

const dogsEndpoint = 'dogs'

const options = {
  json: true
}

const getOldDogs = async (statuses, sort, overrideToday) => {
  const dateOverride = overrideToday ? `&today=${overrideToday}` : ''
  const payload = await get(`${dogsEndpoint}?forPurging=true&statuses=${statuses}&sortKey=${sort?.column ?? 'status'}&sortOrder=${sort?.order ?? 'ASC'}${dateOverride}`, options)
  return payload
}

module.exports = {
  getOldDogs
}
