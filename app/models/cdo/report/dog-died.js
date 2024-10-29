const { errorPusherDefault } = require('../../../lib/error-helpers')
const { buildReportSubTitle, constructDateField } = require('../../../lib/model-helpers')
const { keys } = require('../../../constants/cdo/report')

function ViewModel (payload, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    sourceType: payload?.sourceType,
    pk: payload?.pk,
    subTitle: buildReportSubTitle(payload),
    dateOfDeath: constructDateField(payload, keys.dateOfDeath, 'Date of death'),
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
