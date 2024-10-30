const { forms } = require('../../../constants/forms')
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
      maxlength: forms.maxTextAreaLength,
      hint: {
        text: 'If you are sharing information about a dog, tell us its name.'
      },
      value: data?.details
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
