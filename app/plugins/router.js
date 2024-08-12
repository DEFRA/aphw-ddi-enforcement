const routes = [].concat(
  require('../routes/assets'),
  require('../routes/index'),
  require('../routes/cdo/search/basic'),
  require('../routes/cdo/view/dog-details'),
  require('../routes/cdo/view/check-activities'),
  require('../routes/cdo/view/owner-details'),
  require('../routes/healthy'),
  require('../routes/healthz'),
  require('../routes/cookies'),
  require('../routes/authenticate'),
  require('../routes/login'),
  require('../routes/logout'),
  require('../routes/post-logout'),
  require('../routes/dev-auth')
)

module.exports = {
  plugin: {
    name: 'router',
    register: (server, _) => {
      server.route(routes)
    }
  }
}
