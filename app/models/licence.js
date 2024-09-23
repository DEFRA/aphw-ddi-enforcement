const { errorPusherDefault } = require('../lib/error-helpers')

function ViewModel (payload, errors) {
  this.model = {
    accept: {
      id: 'accept',
      name: 'accept',
      items: [
        {
          value: 'Y',
          text: 'By ticking this box I confirm I have fully read and understood the terms of The Dangerous Dogs Index (DDI) Secure Access Licence (Licence)'
        }
      ]
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
