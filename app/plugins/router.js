const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/cdo/search/basic'),
  require('../routes/cdo/view/dog-details'),
  require('../routes/cdo/view/check-activities'),
  require('../routes/cdo/view/owner-details'),
  require('../routes/cdo/report/report-type'),
  require('../routes/cdo/report/breach-reasons'),
  require('../routes/cdo/report/postcode-lookup'),
  require('../routes/cdo/report/select-address'),
  require('../routes/cdo/report/address'),
  require('../routes/cdo/report/select-dog'),
  require('../routes/cdo/report/dog-died'),
  require('../routes/cdo/report/something-else'),
  require('../routes/cdo/report/confirmation'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/post-logout'),
  require('../routes/unauthorised'),
  require('../routes/denied'),
  require('../routes/denied-access'),
  require('../routes/dev-auth'),
  require('../routes/accessibility'),
  require('../routes/privacy-notice'),
  require('../routes/secure-access-licence'),
  require('../routes/verify-code'),
  require('../routes/feedback')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
