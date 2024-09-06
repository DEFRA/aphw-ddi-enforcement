const jwt = require('jsonwebtoken')
const config = require('../config')
const permissions = require('./permissions')

const generateToken = (payload, { audience, issuer }) => {
  const privateKey = Buffer.from(config.authConfig.privateKey, 'base64').toString()

  const options = {
    expiresIn: '1h',
    algorithm: 'RS256',
    audience,
    issuer,
    keyid: issuer
  }

  return jwt.sign(payload, privateKey, options)
}

const createJwtToken = (audience) => (username, displayname, scopes, token) => {
  const options = {
    audience,
    issuer: 'aphw-ddi-enforcement'
  }

  return generateToken({
    scopes,
    username,
    displayname,
    token
  }, options)
}

const createBearerHeader = (audience) => (user) => {
  const username = user?.username
  const displayname = user?.displayname
  const token = user?.accessToken
  const scopes = [permissions.enforcement]

  const bearerToken = createJwtToken(audience)(username, displayname, scopes, token)

  return {
    Authorization: `Bearer ${bearerToken}`
  }
}

module.exports = {
  generateToken,
  createJwtToken,
  createBearerHeader
}
