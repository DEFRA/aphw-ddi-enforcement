const server = {
  staticCacheTimeoutMillis: 86400000, // 24 hrs,
  hstsMaxAge: 63072000 // 2 yrs
}

const responseStatus = {
  badRequest400: 400,
  notFound404: 404
}

module.exports = {
  server,
  responseStatus
}
