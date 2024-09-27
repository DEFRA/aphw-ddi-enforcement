const Joi = require('joi')

const schema = Joi.object({
  accept: Joi.string().required().messages(
    { '*': 'Tick the box to continue' }
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
