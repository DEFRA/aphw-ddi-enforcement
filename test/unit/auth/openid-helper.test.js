const config = require('../../../app/config')
const { readPublicKey, readPrivateKey, hash, createIssuer } = require('../../../app/auth/openid-helper')

describe('Openid helper', () => {
  test('readPublicKey should read key', () => {
    const configuration = config.authConfig.oidc
    const result = readPublicKey(configuration.identityVerificationPublicKey)
    expect(result).not.toBeNull()
  })

  test('readPrivateKey should read key', () => {
    const configuration = config.authConfig.oidc
    const result = readPrivateKey(configuration.privateKey)
    expect(result).not.toBeNull()
  })

  test('hash should create hash value', () => {
    const result = hash('123456')
    expect(result).toBe('jZae727K08KaOmKSgOaGzww_XVqGr_PKEgIMkjrcbJI')
  })
})
