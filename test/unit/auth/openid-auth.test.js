const config = require('../../../app/config')

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

  test('getAuth should initialise auth if not yet initialised', async () => {
    const result = await getAuth()
    expect(result).not.toBeNull()
    expect(result.client).not.toBeNull()
    expect(result.configuration.privateKey).toBe(config.authConfig.oidc.privateKey)

    const req = { headers: { 'x-forwarded-proto': 'proto1', host: 'localhost' } }
    const h = { state: jest.fn() }
    expect(result.getAuthorizationUrl(req, h, result.client, 'vtr')).toBe('authUrl1')
  })

  test('getRedirectUri should return protocol from headers', async () => {
    const result = getRedirectUri({ headers: { 'x-forwarded-proto': 'proto1', host: 'localhost' } })
    expect(result).toBe('proto1://localhost/authenticate')
  })

  test('getRedirectUri should return url from headers', async () => {
    const result = getRedirectUri({ headers: { host: 'localhost' }, server: { info: { protocol: 'proto2' } } })
    expect(result).toBe('proto2://localhost/authenticate')
  })
})
