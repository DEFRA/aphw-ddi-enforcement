const { jwtVerify, decodeJwt } = require('jose')
const { generators } = require('openid-client')
const { Claims, hash, readPrivateKey, readPublicKey, createIssuer, createClient } = require('./openid-helper')
const config = require('../config')

const SCOPES = ['openid', 'email'] // , 'offline_access']

// Issuer that is must have issued identity claims.
const ISSUER = 'https://identity.integration.account.gov.uk/'

const STATE_COOKIE_NAME = 'state'
const NONCE_COOKIE_NAME = 'nonce'

let ivPublicKey
let client
const configuration = config.authConfig.oidc

const getRedirectUri = req => {
  const protocol = req.headers['x-forwarded-proto'] || req.server.info.protocol
  const host = req.headers.host
  return `${protocol}://${host}/authenticate`
}

const getResult = async (ivPublicKey, client, tokenSet) => {
  if (!tokenSet.access_token) {
    throw new Error('No access token received')
  }

  const accessToken = JSON.stringify(tokenSet.access_token, null, 2)

  const idToken = tokenSet.id_token
  const idTokenDecoded = tokenSet.id_token
    ? JSON.stringify(decodeJwt(tokenSet.id_token), null, 2)
    : undefined

  const refreshToken = tokenSet.refresh_token
    ? tokenSet.refresh_token
    : undefined

  // Use the access token to authenticate the call to userinfo
  // Note: This is an HTTP GET to https://oidc.integration.account.gov.uk/userinfo
  // with the 'Authorization: Bearer ${accessToken}` header
  const userinfo = await client.userinfo(
    tokenSet.access_token
  )

  // If the core identity claim is not present GOV.UK One Login
  // was not able to prove your user’s identity or the claim
  // wasn't requested.
  let coreIdentity
  if (Object.prototype.hasOwnProperty.call(userinfo, Claims.CoreIdentity)) {
    // Read the resulting core identity claim
    // See: https://auth-tech-docs.london.cloudapps.digital/integrate-with-integration-environment/process-identity-information/#process-your-user-s-identity-information
    const coreIdentityJWT = userinfo[Claims.CoreIdentity]

    // Check the validity of the claim using the public key
    const { payload } = await jwtVerify(coreIdentityJWT, ivPublicKey, {
      issuer: ISSUER
    })

    // Check the Vector of Trust (vot) to ensure the expected level of confidence was achieved.
    if (payload.vot !== 'P2') {
      throw new Error('Expected level of confidence was not achieved.')
    }

    coreIdentity = JSON.stringify(payload, null, 2)
  }

  return {
    accessToken,
    refreshToken,
    idToken,
    idTokenDecoded,
    userinfo: JSON.stringify(userinfo, null, 2),
    coreIdentity
  }
}

const buildAuthorizationUrl = (req, h, client, vtr, claims = undefined, additionalParameters = undefined) => {
  const redirectUri = configuration.authorizeRedirectUri ||
    configuration.redirectUri ||
    getRedirectUri(req)

  // Generate values that protect the flow from replay attacks.
  const nonce = generators.nonce()
  const state = generators.state()

  // Store the nonce and state in a session cookie so it can be checked in callback
  h.state(NONCE_COOKIE_NAME, nonce, { isSecure: false, isSameSite: 'Lax' })

  h.state(STATE_COOKIE_NAME, state, { isSecure: false, isSameSite: 'Lax' })

  console.log('openid-auth here4.1 nonce', nonce)
  console.log('/openid-auth here4.2 state', state)

  const authorizationParameters = {
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES.join(' '),
    state: hash(state),
    nonce: hash(nonce),
    vtr: vtr,
    ui_locales: 'en-GB en'
  }

  if (typeof claims === 'object') {
    console.log('claims', claims)
    authorizationParameters.claims = JSON.stringify(claims)
  }

  if (typeof additionalParameters === 'object') {
    Object.assign(authorizationParameters, additionalParameters)
  }

  // Construct the url and redirect on to the authorization endpoint
  return client.authorizationUrl(authorizationParameters)
}

const authInit = async (configuration) => {
  console.log('authInit')
  // Load private key is required for signing token exchange
  const jwks = [readPrivateKey(configuration.privateKey).export({
    format: 'jwk'
  })]

  // Load the public key required to verify the core identity claim
  const ivPublicKey = readPublicKey(
    configuration.identityVerificationPublicKey
  )

  // Configuration for the authority that authenticates users and issues the tokens.
  const issuer = await createIssuer(configuration)

  // The client that requests the tokens.
  const client = createClient(configuration, issuer, jwks)

  return {
    ivPublicKey,
    client
  }
}

const getAuth = async () => {
  if (!ivPublicKey || !client) {
    const res = await authInit(configuration)
    ivPublicKey = res.ivPublicKey
    client = res.client
  }
  return {
    ivPublicKey,
    client,
    configuration
  }
}

module.exports = {
  getAuth,
  buildAuthorizationUrl,
  getRedirectUri,
  STATE_COOKIE_NAME,
  NONCE_COOKIE_NAME,
  getResult
}