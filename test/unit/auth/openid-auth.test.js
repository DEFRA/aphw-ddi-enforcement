const config = require('../../../app/config')
const { getResult } = require('../../../app/auth/openid-auth')
const { keyStubs } = require('../../mocks/auth')
const { createPublicKey } = require('node:crypto')
const { createToken } = require('../../../app/auth/jwt-utils')

const mockIssuer = {}

const mockClient = {
  authorizationUrl: () => 'authUrl1',
  userinfo: jest.fn()
}

describe('Openid auth', () => {
  jest.mock('../../../app/auth/openid-helper')
  const { createIssuer, createClient, readPrivateKey } = require('../../../app/auth/openid-helper')

  const { getAuth, getRedirectUri } = require('../../../app/auth/openid-auth')

  beforeEach(() => {
    createIssuer.mockResolvedValue(mockIssuer)
    createClient.mockReturnValue(mockClient)
    readPrivateKey.mockReturnValue({ export: jest.fn })
  })

  describe('getAuth', () => {
    test('getAuth should initialise auth if not yet initialised', async () => {
      const result = await getAuth()
      expect(result).not.toBeNull()
      expect(result.client).not.toBeNull()
      expect(result.configuration.privateKey).toBe(config.authConfig.oidc.privateKey)

      const req = { headers: { 'x-forwarded-proto': 'proto1', host: 'localhost' } }
      const h = { state: jest.fn() }
      expect(result.getAuthorizationUrl(req, h, result.client, 'vtr')).toContain('https://')

      const result2 = await getAuth()
      expect(result2).not.toBeNull()
      expect(result2.client).not.toBeNull()
      expect(result2.configuration.privateKey).toBe(config.authConfig.oidc.privateKey)

      const req2 = { headers: { 'x-forwarded-proto': 'proto1', host: 'localhost' } }
      const h2 = { state: jest.fn() }
      expect(result.getAuthorizationUrl(req2, h2, result2.client, 'vtr')).toContain('https://')
    })
  })

  describe('getRedirectUri', () => {
    test('getRedirectUri should return protocol from headers', async () => {
      const result = getRedirectUri({ headers: { 'x-forwarded-proto': 'proto1', host: 'localhost' } })
      expect(result).toBe('proto1://localhost/authenticate')
    })

    test('getRedirectUri should return url from headers', async () => {
      const result = getRedirectUri({ headers: { host: 'localhost' }, server: { info: { protocol: 'proto2' } } })
      expect(result).toBe('proto2://localhost/authenticate')
    })
  })

  describe('getAuthorizationUrl', () => {
    test('should get claims if they exist', async () => {
      const auth = await getAuth()
      const req = { headers: { 'x-forwarded-proto': 'proto1', host: 'localhost' } }
      const h = { state: jest.fn() }

      const authUrl = auth.getAuthorizationUrl(req, h, auth.client, 'vtr', { 'can-do-that': true }, { extraParam: 1 })
      expect(authUrl).toContain('can-do-that%22%3Atrue')
      expect(authUrl).toContain('extraParam=1')
    })
  })

  describe('getResult', () => {
    const ivPublicKey = createPublicKey(keyStubs.publicKey)
    const token = createToken(keyStubs.privateKeyHash)({
      at_hash: 'at_hash',
      sub: 'sub',
      vot: 'Cl.Cm',
      iat: Date.now() / 1000,
      nonce: 'nonce',
      vtm: 'https://example.com',
      sid: 'sid'
    }, { audience: 'audience', issuer: 'https://example.com/' })

    const client = {
      authorization_signed_response_alg: 'RS256',
      client_id: 'client_id',
      grant_types: [
        'authorization_code'
      ],
      id_token_signed_response_alg: 'ES256',
      response_types: [
        'code'
      ],
      token_endpoint_auth_method: 'private_key_jwt',
      token_endpoint_auth_signing_alg: 'PS256',
      userinfo: jest.fn()

    }

    test('should get result', async () => {
      client.userinfo.mockResolvedValue({})
      const tokenSet = {
        access_token: 'abcdef',
        id_token: token,
        refresh_token: 'refresh_token',
        token_type: 'Bearer',
        expires_at: (Date.now() / 1000) + (15 * 60)
      }

      const result = await getResult(ivPublicKey, client, tokenSet)
      expect(result).toEqual({
        accessToken: '"abcdef"',
        coreIdentity: undefined,
        idToken: expect.any(String),
        idTokenDecoded: expect.any(String),
        refreshToken: 'refresh_token',
        userinfo: expect.any(String)
      })
      expect(result.idToken.split('.').length).toBe(3)
    })

    test('should get result with CoreIdentity', async () => {
      const coreIdentityJwt = createToken(keyStubs.privateKeyHash)({
        at_hash: 'at_hash',
        sub: 'sub',
        vot: 'P2',
        iat: Date.now() / 1000,
        nonce: 'nonce',
        vtm: 'https://example.com',
        sid: 'sid'
      }, { audience: 'audience', issuer: 'https://identity.integration.account.gov.uk/' })

      client.userinfo.mockResolvedValue({
        'https://vocab.account.gov.uk/v1/coreIdentityJWT': coreIdentityJwt
      })

      const tokenSet = {
        access_token: 'abcdef',
        id_token: token,
        refresh_token: 'refresh_token',
        token_type: 'Bearer',
        expires_at: (Date.now() / 1000) + (15 * 60)
      }

      const result = await getResult(ivPublicKey, client, tokenSet)
      expect(result).toEqual({
        accessToken: '"abcdef"',
        coreIdentity: expect.any(String),
        idToken: expect.any(String),
        idTokenDecoded: expect.any(String),
        refreshToken: 'refresh_token',
        userinfo: expect.any(String)
      })
      expect(result.idToken.split('.').length).toBe(3)
    })

    test('should reject with CoreIdentity if vot is not P2', async () => {
      const coreIdentityJwt = createToken(keyStubs.privateKeyHash)({
        at_hash: 'at_hash',
        sub: 'sub',
        vot: 'Cl.Cm',
        iat: Date.now() / 1000,
        nonce: 'nonce',
        vtm: 'https://example.com',
        sid: 'sid'
      }, { audience: 'audience', issuer: 'https://identity.integration.account.gov.uk/' })

      client.userinfo.mockResolvedValue({
        'https://vocab.account.gov.uk/v1/coreIdentityJWT': coreIdentityJwt
      })

      const tokenSet = {
        access_token: 'abcdef',
        id_token: token,
        refresh_token: 'refresh_token',
        token_type: 'Bearer',
        expires_at: (Date.now() / 1000) + (15 * 60)
      }

      await expect(getResult(ivPublicKey, client, tokenSet)).rejects.toThrow(new Error('Expected level of confidence was not achieved.'))
    })

    test('should get result with no id token or refresh token', async () => {
      client.userinfo.mockResolvedValue({})
      const tokenSet = {
        access_token: 'abcdef',
        token_type: 'Bearer',
        expires_at: (Date.now() / 1000) + (15 * 60)
      }

      const result = await getResult(ivPublicKey, client, tokenSet)
      expect(result).toEqual({
        accessToken: '"abcdef"',
        coreIdentity: undefined,
        idToken: undefined,
        idTokenDecoded: undefined,
        refreshToken: undefined,
        userinfo: expect.any(String)
      })
    })

    test('should reject with an error if there is no access token', async () => {
      const tokenSet = {}

      await expect(getResult(undefined, undefined, tokenSet)).rejects.toThrow(new Error('No access token received'))
    })
  })
})
