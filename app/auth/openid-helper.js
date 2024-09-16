const { createPrivateKey, createHash, createPublicKey } = require('node:crypto')
const { Issuer } = require('openid-client')

const Claims = {
  CoreIdentity: 'https://vocab.account.gov.uk/v1/coreIdentityJWT',
  Address: 'https://vocab.account.gov.uk/v1/address'
}

const readPublicKey = (publicKey) => {
  const armouredKey = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`
  return createPublicKey(armouredKey)
}

const readPrivateKey = (privateKey) => {
  return createPrivateKey({
    key: Buffer.from(privateKey, 'base64'),
    type: 'pkcs8',
    format: 'der'
  })
}

const hash = (value) => {
  return createHash('sha256').update(value).digest('base64url')
}

const createIssuer = async (configuration) => {
  // Override issuer metadata if defined in configuration
  if ('discoveryEndpoint' in configuration) {
    const issuer = await Issuer.discover(configuration.discoveryEndpoint)
    const metadata = Object.assign(
      issuer.metadata,
      configuration.issuerMetadata
    )

    return new Issuer(metadata)
  }
  return new Issuer(configuration.issuerMetadata)
}

const createClient = (configuration, issuer, jwks) => {
  // Override client metadata if defined in configuration
  const clientMetadata = Object.assign(
    {
      // Default configuration for using GOV.UK Sign In
      client_id: configuration.clientId,
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'PS256',
      id_token_signed_response_alg: 'ES256'
    },
    configuration.clientMetadata
  )

  const client = new issuer.Client(clientMetadata, {
    keys: jwks
  })

  return client
}

module.exports = {
  Claims,
  readPublicKey,
  readPrivateKey,
  hash,
  createIssuer,
  createClient
}
