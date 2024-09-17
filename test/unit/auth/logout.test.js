describe('logout', () => {
  const authMock = {
    ivPublicKey: 'abcdefghi',
    configuration: {
      privateKey: 'jklmnopqrstuvwxyz',
      identityVerificationPublicKey: 'abcdefghi',
      clientId: 'LmnopQrstuVwxyZ',
      discoveryEndpoint: 'https://openid.com',
      postLogoutUri: 'http://localhost:3003/post-logout'
    },
    client: {
      endSessionUrl: jest.fn()
    }
  }
  jest.mock('../../../app/auth/openid-auth')
  const { getAuth } = require('../../../app/auth/openid-auth')

  const { logoutUser } = require('../../../app/auth/logout')

  getAuth.mockResolvedValue(authMock)

  test('should logout a user with default url', async () => {
    authMock.client.endSessionUrl.mockResolvedValue('https://example.com')

    const logoutResult = await logoutUser('xyzABCdef')
    expect(logoutResult).toBe('https://example.com')
    expect(authMock.client.endSessionUrl).toHaveBeenCalledWith({
      id_token_hint: 'xyzABCdef',
      post_logout_redirect_uri: 'http://localhost:3003/post-logout'
    })
  })

  test('should logout a user with custom url', async () => {
    await logoutUser('xyzABCdef', 'https://localhost:3003/not-authorised')
    expect(authMock.client.endSessionUrl).toHaveBeenCalledWith({
      id_token_hint: 'xyzABCdef',
      post_logout_redirect_uri: 'https://localhost:3003/not-authorised'
    })
  })
})
