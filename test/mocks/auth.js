const { enforcement } = require('../../app/auth/permissions')
const { generateKeyPairSync } = require('crypto')

const user = {
  userId: '1',
  username: 'test@example.com',
  accessToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t',
  scopes: [enforcement]
}

const userForAuth = {
  username: 'test@example.com',
  name: 'Example Tester',
  userId: '1',
  accessToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t',
  scopes: [enforcement]
}

const userWithDisplayname = {
  userId: '1',
  username: 'test@example.com',
  displayname: 'Example Tester',
  accessToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t',
  scopes: [enforcement]
}

const userFullAuth = {
  userId: '508d176b-9063-4d48-8a02-6aa93c287a16',
  displayname: 'test@example.com',
  username: 'test@example.com',
  idToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t',
  accessToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t',
  scopes: [enforcement]

}
const auth = { strategy: 'session-auth', credentials: { scope: [enforcement], account: userForAuth } }

const standardAuth = { strategy: 'session-auth', credentials: { scope: [enforcement], account: userForAuth } }

const generateKeyStubs = () => {
  const { privateKey: privateKeyObj, publicKey: publicKeyObj } = generateKeyPairSync('rsa', {
    modulusLength: 2048
  })

  const privateKeyPem = privateKeyObj.export({ format: 'pem', type: 'pkcs8' })
  const publicKeyPem = publicKeyObj.export({ format: 'pem', type: 'spki' })

  const privateKey = privateKeyPem.toString('base64')
  const publicKey = publicKeyPem.toString('base64')

  return {
    privateKey,
    publicKey,
    privateKeyHash: Buffer.from(privateKey).toString('base64'),
    publicKeyHash: Buffer.from(publicKey).toString('base64')
  }
}

const keyStubs = generateKeyStubs()

module.exports = {
  auth,
  standardAuth,
  userWithDisplayname,
  user,
  userFullAuth,
  generateKeyStubs,
  keyStubs
}
