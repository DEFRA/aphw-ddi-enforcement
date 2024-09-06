
describe('azure authentication', () => {
  const OLD_ENV = process.env

  beforeEach(() => {
    jest.resetModules() // Most important - it clears the cache
    process.env = { ...OLD_ENV } // Make a copy
  })

  afterAll(() => {
    process.env = OLD_ENV // Restore old environment
  })

  test('getAuthenticationUrl should call getAuthCodeUrl once', () => {
    process.env.AUTHENTICATION_ENABLED = 'true'

    jest.mock('../../../app/auth/azure-auth', () => ({
      getAuthenticationUrl: jest.fn()
    }))
    const { getAuthenticationUrl } = require('../../../app/auth/oidc-auth')

    jest.mock('../../../app/auth/map-auth')
    jest.mock('../../../app/auth/get-user')

    const auth = require('../../../app/auth')
    auth.getAuthenticationUrl()
    expect(getAuthenticationUrl).toHaveBeenCalledTimes(1)
  })
})
