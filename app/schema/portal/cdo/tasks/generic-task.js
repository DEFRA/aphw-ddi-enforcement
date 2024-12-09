const Joi = require('joi')

const cdoTasksGetSchema = Joi.object({
  dogIndex: Joi.string().required(),
  taskName: Joi.string().valid('submit-form-two').valid('record-microchip-deadline').required()
})

module.exports = {
  cdoTasksGetSchema
}
