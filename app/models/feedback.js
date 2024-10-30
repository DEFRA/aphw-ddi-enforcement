const { errorPusherDefault } = require('../lib/error-helpers')

const satisfactionOptions = [
  { text: 'Very satisfied', value: 'Very satisfied' },
  { text: 'Satisfied', value: 'Satisfied' },
  { text: 'Neither satisfied or dissatisfied', value: 'Neither satisfied or dissatisfied' },
  { text: 'Dissatisfied', value: 'Dissatisfied' },
  { text: 'Very dissatisfied', value: 'Very dissatisfied' }
]

const completedTaskOptions = [
  { text: 'Yes', value: 'Yes' },
  { text: 'No', value: 'No' }
]

function ViewModel (payload, logout, errors) {
  this.model = {
    completedTask: {
      id: 'completedTask',
      name: 'completedTask',
      fieldset: {
        legend: {
          text: 'Did you complete your task today?',
          classes: 'govuk-fieldset__legend--m'
        }
      },
      value: payload?.completedTask,
      items: completedTaskOptions
    },
    details: {
      id: 'details',
      name: 'details',
      maxlength: 1200,
      label: {
        text: 'Can you provide more detail? (optional)',
        classes: 'govuk-label--m'
      },
      hint: {
        text: 'Do not include personal information like your name, phone number or email address.'
      },
      value: payload?.details
    },
    satisfaction: {
      id: 'satisfaction',
      name: 'satisfaction',
      fieldset: {
        legend: {
          text: 'Overall, how did you feel about the service you received today?',
          classes: 'govuk-fieldset__legend--m'
        }
      },
      value: payload?.satisfaction,
      items: satisfactionOptions
    },
    isLogout: !!logout,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
