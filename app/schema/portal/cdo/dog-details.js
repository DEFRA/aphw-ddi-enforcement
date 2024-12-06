const Joi = require('joi')

/**
 * @param {string[]} disallowedMicrochipIds
 * @return {Joi.ObjectSchema<any>}
 */
const microchipValidation = (disallowedMicrochipIds) => Joi.object({
  microchipNumber: Joi.string().optional().allow('').allow(null).disallow(...disallowedMicrochipIds).messages({
    '*': 'Microchip number already exists'
  }),
  microchipNumber2: Joi.string().optional().allow('').allow(null).disallow(...disallowedMicrochipIds).messages({
    '*': 'Microchip number already exists'
  })
})

module.exports = {
  microchipValidation
}
