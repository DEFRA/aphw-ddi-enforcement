const config = require('../../../app/config')
const { readPublicKey, readPrivateKey, hash, createIssuer } = require('../../../app/auth/openid-helper')
const { Issuer } = require('openid-client')

describe('Openid helper', () => {
  describe('readPublicKey', () => {
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
  })

  describe('hash', () => {
    test('hash should create hash value', () => {
      const result = hash('123456')
      expect(result).toBe('jZae727K08KaOmKSgOaGzww_XVqGr_PKEgIMkjrcbJI')
    })
  })

  describe('createIssuer', () => {
    test('should create an issuer if discovery endpoint is missing', async () => {
      const config = {
        issuerMetadata: {}
      }
      const issuer = await createIssuer(config)
      expect(issuer).toBeInstanceOf(Issuer)
    })
  })
})
