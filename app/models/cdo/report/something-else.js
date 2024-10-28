const { errorPusherDefault } = require('../../../lib/error-helpers')
const { buildReportSubTitle } = require('../../../lib/model-helpers')

function ViewModel (data, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    pk: data?.pk,
    sourceType: data?.sourceType,
    subTitle: buildReportSubTitle(data),
    details: {
      id: 'details',
      name: 'details',
      maxlength: 1200,
      hint: {
        text: 'Do not include personal information like your name, phone number or email address.'
      },
      value: data?.details
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
