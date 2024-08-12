const Joi = require('joi')

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
    ttl: Joi.number().default(60 * 60 * 1000)
  }),
  redirectUrl: Joi.string().default('http://localhost:3003/authenticate')
})

// Build config
const config = {
  enabled: process.env.AUTHENTICATION_ENABLED,
  oidc: {
    privateKey: process.env.PRIVATE_KEY,
    identityVerificationPublicKey: process.env.PUBLIC_KEY,
    clientId: process.env.CLIENT_ID,
    // redirectUri: 'http://localhost:3003/authenticate',
    discoveryEndpoint: 'https://oidc.integration.account.gov.uk/.well-known/openid-configuration',
    postLogoutUri: 'http://localhost:3003/post-logout'
  },
  cookie: {
    password: process.env.COOKIE_PASSWORD,
    ttl: process.env.COOKIE_TTL
  },
  redirectUrl: process.env.REDIRECT_URL?.length > 0 ? process.env.REDIRECT_URL : 'http://localhost:3003/authenticate'
}

// Validate config
const result = schema.validate(config, {
  abortEarly: false
})

// Throw if config is invalid
if (result.error) {
  throw new Error(`The auth config is invalid. ${result.error.message}`)
}

module.exports = result.value
