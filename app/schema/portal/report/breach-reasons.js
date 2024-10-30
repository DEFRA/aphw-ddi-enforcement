const Joi = require('joi')
const { validatePayloadBuilder } = require('../../validate')

const schema = Joi.object({
  dogBreaches: Joi.array().items(Joi.string()).single().min(1).required().messages({
    '*': 'Select all reasons the dog is in breach'

  })
}).required()

const validatePayload = validatePayloadBuilder(schema)

module.exports = {
  validatePayload
}
