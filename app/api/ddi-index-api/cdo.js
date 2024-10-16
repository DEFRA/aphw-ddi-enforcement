const { get } = require('./base')

const cdoEndpoint = 'cdo'

/**
 * @param indexNumber
 * @param user
 * @return {any}
 */
const getCdo = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, user)
  return payload.cdo
}

const getCdoFromActivities = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}?type=activity`, user)
  return payload.cdo
}

module.exports = {
  getCdo,
  getCdoFromActivities
}
