const jwt = require('jsonwebtoken')
const config = require('../config')
const permissions = require('./permissions')

const createToken = (privateKeyBase64) => (payload, { audience, issuer }) => {
  const privateKey = Buffer.from(privateKeyBase64, 'base64').toString()

  const options = {
    expiresIn: '1h',
    algorithm: 'RS256',
    audience,
    issuer,
    keyid: issuer
  }

  return jwt.sign(payload, privateKey, options)
}

const generateToken = createToken(config.authConfig.privateKey)

const createJwtToken = (audience) => (username, displayname, scope, token) => {
  const options = {
    audience,
    issuer: 'aphw-ddi-enforcement'
  }

  return generateToken({
    scope,
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
  createToken,
  generateToken,
  createJwtToken,
  createBearerHeader
}
