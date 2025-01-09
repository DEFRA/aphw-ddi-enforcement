const { v4: uuidv4 } = require('uuid')
const { DOWNLOAD_REQUESTED } = require('../../../constants/events')

const createMessage = (data, userObj) => ({
  body: {
    certificateId: uuidv4(),
    exemptionOrder: data.exemption.exemptionOrder,
    user: {
      username: userObj.username,
      displayname: userObj.displayname
    },
    owner: {
      name: `${data.person.firstName} ${data.person.lastName}`,
      birthDate: data.person.dateOfBirth,
      address: {
        line1: data.person.addresses[0].address.address_line_1,
        line2: data.person.addresses[0].address.address_line_2,
        line3: data.person.addresses[0].address.town,
        postcode: data.person.addresses[0].address.postcode,
        country: data.person.addresses[0].address.country?.country
      },
      organisationName: data.person.organisationName
    },
    dog: {
      indexNumber: data.dog.indexNumber,
      microchipNumber: data.dog.microchipNumber,
      microchipNumber2: data.dog.microchipNumber2,
      name: data.dog.name,
      breed: data.dog.breed,
      sex: data.dog.sex,
      birthDate: data.dog.dateOfBirth,
      colour: data.dog.colour
    },
    exemption: {
      status: data.dog.status,
      exemptionOrder: data.exemption.exemptionOrder,
      certificateIssued: data.exemption.certificateIssued,
      cdoIssued: data.exemption.cdoIssued,
      cdoExpiry: data.exemption.cdoExpiry,
      insuranceRenewal: data.exemption.insurance ? data.exemption.insurance[0].insuranceRenewal : undefined,
      breachReasons: data.dog.breaches
    }
  },
  type: DOWNLOAD_REQUESTED,
  source: 'aphw-ddi-enforcement'
})

module.exports = {
  createMessage
}
