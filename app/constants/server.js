const server = {
  staticCacheTimeoutMillis: 86400000, // 24 hrs,
  hstsMaxAge: 63072000 // 2 yrs
}

const statusCodes = {
  404: 404
}

module.exports = {
  server,
  statusCodes
}
