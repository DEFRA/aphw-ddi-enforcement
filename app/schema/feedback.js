const Joi = require('joi')
const { forms } = require('../constants/forms')

const schema = Joi.object({
  completedTask: Joi.string().required().messages(
    { '*': 'Select an option' }
  ),
  details: Joi.string().allow('').allow(null).optional().max(forms.maxTextAreaLength).messages({
    'string.max': 'Enter less than 1200 characters'
  }),
  satisfaction: Joi.string().required().messages(
    { '*': 'Select an option' }
  )
}).required()

const validatePayload = (payload) => {
  const { value, error } = schema.validate(payload, { abortEarly: false })

  if (error) {
    throw error
  }

  return value
}

module.exports = {
  validatePayload
}
