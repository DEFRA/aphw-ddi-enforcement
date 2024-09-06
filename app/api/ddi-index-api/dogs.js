const { get } = require('./base')

const dogsEndpoint = 'dogs'

const getOldDogs = async (statuses, user, sort, overrideToday) => {
  const dateOverride = overrideToday ? `&today=${overrideToday}` : ''
  const payload = await get(`${dogsEndpoint}?forPurging=true&statuses=${statuses}&sortKey=${sort?.column ?? 'status'}&sortOrder=${sort?.order ?? 'ASC'}${dateOverride}`, user)
  return payload
}

module.exports = {
  getOldDogs
}
