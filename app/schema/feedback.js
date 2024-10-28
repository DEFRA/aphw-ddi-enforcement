const Joi = require('joi')

const schema = Joi.object({
  completedTask: Joi.string().required().messages(
    { '*': 'Select an option' }
  ),
  details: Joi.string().allow('').allow(null).optional().max(1200).messages({
    'string.max': 'Details must be 1200 characters or less'
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
