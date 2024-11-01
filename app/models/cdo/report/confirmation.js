const { buildReportSubTitle } = require('../../../lib/model-helpers')
const { reportTypes } = require('./report-type')

function ViewModel (payload) {
  this.model = {
    sourceType: payload?.sourceType,
    pk: payload?.pk,
    dogIndexOverride: payload?.reportType === reportTypes.somethingElse ? undefined : payload?.dogChosen?.indexNumber,
    subTitle: buildReportSubTitle(payload),
    numberOfDogs: payload?.dogs?.length ?? 1
  }
}

module.exports = ViewModel
