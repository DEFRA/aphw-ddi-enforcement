const { admin, standard } = require('../../app/auth/permissions')

const user = {
  userId: '1',
  username: 'test@example.com'
}

const userForAuth = {
  username: 'test@example.com',
  name: 'Example Tester',
  homeAccountId: '1'
}

const userWithDisplayname = {
  userId: '1',
  username: 'test@example.com',
  displayname: 'Example Tester'
}

const userFullAuth = {
  userId: '508d176b-9063-4d48-8a02-6aa93c287a16',
  displayname: 'test@example.com',
  username: 'test@example.com',
  idToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t',
  accessToken: 'dGVzdEBleGFtcGxlLmNvbTp0ZXN0QGV4YW1wbGUuY29t'

}

const auth = { strategy: 'session-auth', credentials: { scope: [admin], account: userForAuth } }

const standardAuth = { strategy: 'session-auth', credentials: { scope: [standard], account: userForAuth } }

const adminAuth = auth

module.exports = {
  auth,
  adminAuth,
  standardAuth,
  userWithDisplayname,
  user
}
