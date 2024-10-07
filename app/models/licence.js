const { errorPusherDefault } = require('../lib/error-helpers')

function ViewModel (errors) {
  this.model = {
    accept: {
      id: 'accept',
      name: 'accept',
      items: [
        {
          value: 'Y',
          text: 'By ticking this box I confirm I have read and accepted the terms of The Dangerous Dogs Index Secure Access Licence'
        }
      ]
    },
    errors: []
  }

  errorPusherDefault(errors, this.model)
}

module.exports = ViewModel
