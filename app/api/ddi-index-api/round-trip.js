const { get } = require('./base')

const endpoint = 'round-trip'

const doRoundTrip = async (user) => {
  console.log('do round-trip')
  await get(`${endpoint}?r=${new Date()}`, user)
  return true
}

module.exports = {
  doRoundTrip
}
