const { clearSessionDown } = require('../session/session-wrapper')

const errorPusherDefault = (errors, model) => {
  if (errors) {
    for (const error of errors.details) {
      const name = error.path[0] ?? error.context.path[0]
      const prop = model[name]

      if (prop) {
        prop.errorMessage = { text: error.message }
        model.errors.push({ text: error.message, href: `#${name}` })
      }
    }
  }
}

const code401 = 401
const code403 = 403
const code404 = 404

const processPreErrorPageResponse = (request, h) => {
  const response = request.response

  if (response.isBoom) {
    // An error was raised during
    // processing the request
    const statusCode = response.output.statusCode

    console.log('statusCode', statusCode)
    // if not authorised then request login
    if (statusCode === code401 || statusCode === code403) {
      clearSessionDown(request, h)
      return h.view('unauthorized').code(statusCode)
    }

    // In the event of 404
    // return the `404` view
    if (statusCode === code404) {
      return h.view('404', { nav: { homeLink: '/' } }).code(statusCode)
    }

    request.log('error', {
      statusCode,
      data: response.data,
      message: response.message
    })

    // The return the `500` view
    return h.view('500', { nav: { homeLink: '/' } }).code(statusCode)
  }
  return undefined
}

module.exports = {
  errorPusherDefault,
  processPreErrorPageResponse
}
