const { get } = require('./base')

const cdoEndpoint = 'cdo'

const getCdo = async (indexNumber, user) => {
  const payload = await get(`${cdoEndpoint}/${indexNumber}`, user)
  return payload.cdo
}

module.exports = {
  getCdo
}
