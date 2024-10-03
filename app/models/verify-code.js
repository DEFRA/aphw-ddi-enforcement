const { errorPusherDefault } = require('../lib/error-helpers')
const { forms } = require('../constants/forms')

function ViewModel (payload, errors) {
  this.model = {
    code: {
      id: 'code',
      name: 'code',
      label: {
        text: 'Enter the 6 digit security code'
      },
      value: payload?.code,
      autocomplete: forms.preventAutocomplete,
      attributes: { maxlength: '10' },
      classes: 'govuk-input--width-10'

    },
    username: payload?.user?.username,
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
