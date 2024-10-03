const { errorPusherDefault } = require('../lib/error-helpers')

const satisfactionOptions = [
  { text: 'Very satisfied', value: 'Very satisfied' },
  { text: 'Satisfied', value: 'Satisfied' },
  { text: 'Neither satisfied or dissatisfied', value: 'Neither satisfied or dissatisfied' },
  { text: 'Dissatisfied', value: 'Dissatisfied' },
  { text: 'Very dissatisfied', value: 'Very dissatisfied' }
]

function ViewModel (payload, errors) {
  this.model = {
    satisfaction: {
      id: 'satisfaction',
      name: 'satisfaction',
      fieldset: {
        legend: {
          text: 'Overall, how did you feel about the service you received today?',
          classes: 'govuk-fieldset__legend--s'
        }
      },
      value: payload?.satisfaction,
      items: satisfactionOptions
    },
    improvements: {
      id: 'improvements',
      name: 'improvements',
      maxlength: 1200,
      label: {
        text: 'How could we improve this service?',
        classes: 'govuk-label--s'
      },
      hint: {
        text: 'Do not include sensitive information.'
      },
      value: payload?.improvements
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
