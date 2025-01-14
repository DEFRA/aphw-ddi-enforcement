const { errorPusherDefault } = require('../../../lib/error-helpers')

function ViewModel (indexNumber, backNav, error) {
  this.model = {
    backLink: backNav.backLink,
    cancelLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    indexNumber,
    generalError: {},
    errors: []
  }

  errorPusherDefault(error, this.model)
}

module.exports = ViewModel
