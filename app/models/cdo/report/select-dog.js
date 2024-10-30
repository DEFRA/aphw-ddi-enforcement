const { errorPusherDefault } = require('../../../lib/error-helpers')
const { formatDogRadioAsHtml } = require('../../../lib/format-helpers')
const { buildReportSubTitle, buildReportTitle } = require('../../../lib/model-helpers')

function ViewModel (details, dogResults, backNav, errors) {
  this.model = {
    backLink: backNav.backLink,
    subTitle: buildReportSubTitle(details, true),
    title: buildReportTitle(details),
    selectDogFieldset: {
      legend: {
        text: 'Which of the owner\'s dogs is in breach?',
        classes: 'govuk-fieldset__legend--l govuk-!-margin-bottom-6',
        isPageHeading: true
      }
    },
    dogs: dogResults,
    dog: {
      id: 'dog',
      name: 'dog',
      items: dogResults.map((val, idx) => ({
        html: formatDogRadioAsHtml(val),
        value: `${idx + 1}`
      })),
      value: details?.dogChosen?.arrayInd
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
