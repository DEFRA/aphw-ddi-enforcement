/*
* Add an `onPreResponse` listener to return error pages
*/

const { clearSessionDown } = require('../session/session-wrapper')

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const response = request.response

        if (response.isBoom) {
          // An error was raised during
          // processing the request
          const statusCode = response.output.statusCode

          // if not authorised then request login
          if (statusCode === 401 || statusCode === 403) {
            clearSessionDown(request, h)
            return h.view('unauthorized').code(statusCode)
          }

          // In the event of 404
          // return the `404` view
          if (statusCode === 404) {
            return h.view('404').code(statusCode)
          }

          request.log('error', {
            statusCode,
            data: response.data,
            message: response.message
          })

          // The return the `500` view
          return h.view('500').code(statusCode)
        }
        return h.continue
      })
    }
  }
}
