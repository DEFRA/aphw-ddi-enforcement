const { admin } = require('./permissions')
const { v4: uuidv4 } = require('uuid')
const devAccount = require('./dev-account')

const authType = 'dev'

const getAuthenticationUrl = () => {
  return '/dev-auth'
}

const currentRole = admin // standard

const authenticate = async (redirectCode, cookieAuth) => {
  cookieAuth.set({
    scope: [currentRole],
    account: devAccount
  })
}

const logout = async (account) => {
  devAccount.userId = uuidv4()
  devAccount.username = null
  devAccount.displayname = null
}

module.exports = {
  authType,
  getAuthenticationUrl,
  authenticate,
  logout
}
