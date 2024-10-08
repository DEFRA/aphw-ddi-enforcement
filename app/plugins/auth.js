const config = require('../config')
const authCookie = require('@hapi/cookie')

module.exports = {
  plugin: {
    name: 'auth',
    register: async (server) => {
      await server.register(authCookie)

      server.auth.strategy('session-auth', 'cookie', {
        cookie: {
          name: 'session-auth',
          password: config.authConfig.cookie.password,
          ttl: config.authConfig.cookie.ttl,
          path: '/',
          isSecure: config.isProd,
          isSameSite: 'Lax' // Needed for the post authentication redirect
        },
        keepAlive: true, // Resets the cookie ttl after each route
        redirectTo: '/login',
        appendNext: true
      })

      server.auth.default('session-auth')
    }
  }
}
