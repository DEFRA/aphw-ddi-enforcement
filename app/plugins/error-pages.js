/*
* Add an `onPreResponse` listener to return error pages
*/

const { processPreErrorPageResponse } = require('../lib/error-helpers')

module.exports = {
  plugin: {
    name: 'error-pages',
    register: (server, options) => {
      server.ext('onPreResponse', (request, h) => {
        const res = processPreErrorPageResponse(request, h)
        if (res) {
          return res
        }
        return h.continue
      })
    }
  }
}
