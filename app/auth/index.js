const config = require('../config').authConfig
const auth = config.enabled ? require('./openid-auth') : require('./dev-auth')
const mapAuth = require('./map-auth')
const getUser = require('./get-user')

module.exports = {
  ...auth,
  mapAuth,
  getUser
}
