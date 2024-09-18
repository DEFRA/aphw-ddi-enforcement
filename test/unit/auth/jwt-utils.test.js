const jwt = require('jsonwebtoken')
const { keyStubs } = require('../../mocks/auth')

describe('jwt-utils', () => {
  jest.mock('../../../app/lib/environment-helpers')
  const { getEnvironmentVariable, getEnvironmentVariableOrString } = require('../../../app/lib/environment-helpers')
  getEnvironmentVariable.mockImplementation((envVar) => {
    if (envVar === 'JWT_PRIVATE_KEY') {
      return keyStubs.privateKeyHash
    }

    if (envVar === 'DDI_API_BASE_URL') {
      return 'https://example.abc'
    }

    return process.env[envVar]
  })
  getEnvironmentVariableOrString.mockReturnValue('')

  const { generateToken, createJwtToken, createBearerHeader } = require('../../../app/auth/jwt-utils')

  describe('generateToken', () => {
    test('should generate a token', () => {
      const token = generateToken({ username: 'bob@builder.com' }, { audience: 'https://example.abc', issuer: 'abc' })
      expect(typeof token).toBe('string')

      expect(jwt.verify(token, keyStubs.publicKey)).toEqual({
        username: 'bob@builder.com',
        exp: expect.any(Number),
        iat: expect.any(Number),
        iss: 'abc',
        aud: 'https://example.abc'
      })
    })
  })

  describe('createJwtToken', () => {
    test('should generate an azure ad token', () => {
      const expected = {
        exp: expect.any(Number),
        iat: expect.any(Number),
        iss: 'aphw-ddi-enforcement',
        scopes: ['abc'],
        username: 'bob@builder.com',
        token: 'ABCDEFG12345',
        displayname: 'Bob the Builder',
        aud: 'https://example.abc'
      }

      const token = createJwtToken('https://example.abc')('bob@builder.com', 'Bob the Builder', ['abc'], 'ABCDEFG12345')

      const decodedToken = jwt.verify(
        token,
        keyStubs.publicKey,
        {
          audience: 'https://example.abc',
          algorithms: ['RS256'],
          issuer: 'aphw-ddi-enforcement'
        })
      expect(typeof token).toBe('string')
      expect(decodedToken).toEqual(expected)
    })
  })

  describe('createBearer', () => {
    test('should create a Bearer Header', () => {
      const expected = {
        exp: expect.any(Number),
        iat: expect.any(Number),
        iss: 'aphw-ddi-enforcement',
        scopes: ['Dog.Index.Enforcement'],
        username: 'bob@builder.com',
        token: 'ABCDEFG12345',
        displayname: 'Bob the Builder',
        aud: 'https://example.abc'
      }

      const user = {
        username: 'bob@builder.com',
        displayname: 'Bob the Builder',
        accessToken: 'ABCDEFG12345'
      }
      const { Authorization } = createBearerHeader('https://example.abc')(user)

      const token = Authorization.replace('Bearer ', '')

      const decodedToken = jwt.verify(
        token,
        keyStubs.publicKey,
        {
          audience: 'https://example.abc',
          algorithms: ['RS256'],
          issuer: 'aphw-ddi-enforcement'
        })

      expect(decodedToken).toEqual(expected)
    })
  })
})
