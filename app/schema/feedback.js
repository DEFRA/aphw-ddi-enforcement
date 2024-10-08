const Joi = require('joi')

const schema = Joi.object({
  satisfaction: Joi.string().required().messages(
    { '*': 'Select an option' }
  ),
  completedTask: Joi.string().required().messages(
    { '*': 'Select an option' }
  ),
  details: Joi.string().allow('').allow(null).optional()
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
