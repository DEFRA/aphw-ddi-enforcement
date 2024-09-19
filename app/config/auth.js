const Joi = require('joi')
const { getEnvironmentVariable } = require('../lib/environment-helpers')

const SECOND = 1000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DEV_AUTHENTICATE_URL = 'http://localhost:3003/authenticate'

// Define config schema
const schema = Joi.object({
  enabled: Joi.boolean().default(false),
  oidc: Joi.object({
    privateKey: Joi.string().allow(''),
    identityVerificationPublicKey: Joi.string().allow(''),
    clientId: Joi.string().allow(''),
    redirectUri: Joi.string().allow(''),
    postLogoutUri: Joi.string().allow(''),
    discoveryEndpoint: Joi.string().allow('')
  }),
  cookie: Joi.object({
    password: Joi.string().required(),
    ttl: Joi.number().default(HOUR + MINUTE)
  }),
  privateKey: Joi.string().allow(''),
  redirectUrl: Joi.string().default(DEV_AUTHENTICATE_URL)
})

// Build config
const config = {
  enabled: process.env.AUTHENTICATION_ENABLED,
  oidc: {
    privateKey: process.env.OPENID_PRIVATE_KEY,
    identityVerificationPublicKey: process.env.OPENID_PUBLIC_KEY,
    clientId: process.env.OPENID_CLIENT_ID,
    redirectUri: process.env.REDIRECT_URL?.length > 0 ? process.env.REDIRECT_URL : DEV_AUTHENTICATE_URL,
    discoveryEndpoint: process.env.OPENID_DISCOVERY_ENDPOINT?.length > 0 ? process.env.OPENID_DISCOVERY_ENDPOINT : 'https://oidc.integration.account.gov.uk/.well-known/openid-configuration',
    postLogoutUri: process.env.POST_LOGOUT_URL?.length > 0 ? process.env.POST_LOGOUT_URL : 'http://localhost:3003/post-logout'
  },
  cookie: {
    password: process.env.COOKIE_PASSWORD,
    ttl: process.env.COOKIE_TTL
  },
  privateKey: getEnvironmentVariable('JWT_PRIVATE_KEY'),
  redirectUrl: process.env.REDIRECT_URL?.length > 0 ? process.env.REDIRECT_URL : DEV_AUTHENTICATE_URL
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The auth config is invalid. ${result.error.message}`)
}

console.log('config postLogoutUri', result.value.oidc.postLogoutUri)
console.log('config redirectUri', result.value.oidc.redirectUri)
console.log('config discoveryEndpoint', result.value.oidc.discoveryEndpoint)

module.exports = result.value
