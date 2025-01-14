jest.mock('ffc-messaging')
const { MessageSender } = require('ffc-messaging')

jest.mock('uuid')
const { v4: uuidv4 } = require('uuid')

const { sendMessage } = require('../../../app/messaging/outbound/download')
const { user } = require('../../mocks/auth')

describe('download request message sender', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('should send message', async () => {
    uuidv4.mockReturnValue('1234')

    const cdo = {
      exemption: {
        exemptionOrder: 2015
      },
      person: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        addresses: [
          {
            address: {
              address_line_1: '12 Test Street',
              address_line_2: '',
              town: 'Test City',
              postcode: 'TST 1AA'
            }
          }
        ]
      },
      dog: {
        indexNumber: 'ED1234',
        microchipNumber: '1234',
        name: 'Fido',
        breed: 'XL Bully',
        sex: 'Male',
        dateOfBirth: new Date('2020-01-01'),
        colour: 'White'
      }
    }

    await sendMessage(cdo, user)

    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledWith({
      body: {
        certificateId: '1234',
        exemptionOrder: 2015,
        owner: {
          name: 'Joe Bloggs',
          address: {
            line1: '12 Test Street',
            line2: '',
            line3: 'Test City',
            postcode: 'TST 1AA',
            country: undefined
          },
          birthDate: undefined,
          organisationName: undefined
        },
        dog: {
          indexNumber: 'ED1234',
          microchipNumber: '1234',
          microchipNumber2: undefined,
          name: 'Fido',
          breed: 'XL Bully',
          sex: 'Male',
          birthDate: new Date('2020-01-01'),
          colour: 'White'
        },
        exemption: {
          status: undefined,
          breachReasons: undefined,
          cdoIssued: undefined,
          cdoExpiry: undefined,
          certificateIssued: undefined,
          insuranceRenewal: undefined,
          exemptionOrder: 2015
        },
        user: {
          username: 'test@example.com',
          displayname: undefined
        }
      },
      type: 'uk.gov.defra.aphw.ddi.download.requested',
      source: 'aphw-ddi-enforcement'
    })
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalled()
  })

  test('should send message including organisation and all other fields populated', async () => {
    uuidv4.mockReturnValue('1234')

    const cdo = {
      exemption: {
        exemptionOrder: 2015,
        cdoIssued: new Date(2024, 11, 12),
        cdoExpiry: new Date(2025, 1, 12),
        certificateIssued: new Date(2024, 11, 20),
        insurance: [
          { insuranceRenewal: new Date(2025, 10, 5) }
        ]
      },
      person: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        addresses: [
          {
            address: {
              address_line_1: '12 Test Street',
              address_line_2: '',
              town: 'Test City',
              postcode: 'TST 1AA',
              country: { country: 'England' }
            }
          }
        ],
        organisationName: 'Test org'
      },
      dog: {
        indexNumber: 'ED1234',
        microchipNumber: '1234',
        microchipNumber2: '4567',
        name: 'Fido',
        breed: 'XL Bully',
        sex: 'Male',
        dateOfBirth: new Date('2020-01-01'),
        colour: 'White',
        status: 'In breach',
        breaches: ['Reason 1', 'Reason 2']
      }
    }

    await sendMessage(cdo, user)

    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledWith({
      body: {
        certificateId: '1234',
        exemptionOrder: 2015,
        owner: {
          name: 'Joe Bloggs',
          address: {
            line1: '12 Test Street',
            line2: '',
            line3: 'Test City',
            postcode: 'TST 1AA',
            country: 'England'
          },
          birthDate: undefined,
          organisationName: 'Test org'
        },
        dog: {
          indexNumber: 'ED1234',
          microchipNumber: '1234',
          microchipNumber2: '4567',
          name: 'Fido',
          breed: 'XL Bully',
          sex: 'Male',
          birthDate: new Date('2020-01-01'),
          colour: 'White'
        },
        exemption: {
          status: 'In breach',
          breachReasons: ['Reason 1', 'Reason 2'],
          cdoIssued: new Date(2024, 11, 12),
          cdoExpiry: new Date(2025, 1, 12),
          certificateIssued: new Date(2024, 11, 20),
          insuranceRenewal: new Date(2025, 10, 5),
          exemptionOrder: 2015
        },
        user: {
          username: 'test@example.com',
          displayname: undefined
        }
      },
      type: 'uk.gov.defra.aphw.ddi.download.requested',
      source: 'aphw-ddi-enforcement'
    })
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalled()
  })

  test('should send message even when insurance is missing', async () => {
    uuidv4.mockReturnValue('1234')

    const cdo = {
      exemption: {
        exemptionOrder: 2015,
        cdoIssued: new Date(2024, 11, 12),
        cdoExpiry: new Date(2025, 1, 12),
        certificateIssued: new Date(2024, 11, 20),
        insurance: []
      },
      person: {
        firstName: 'Joe',
        lastName: 'Bloggs',
        addresses: [
          {
            address: {
              address_line_1: '12 Test Street',
              address_line_2: '',
              town: 'Test City',
              postcode: 'TST 1AA',
              country: { country: 'England' }
            }
          }
        ],
        organisationName: 'Test org'
      },
      dog: {
        indexNumber: 'ED1234',
        microchipNumber: '1234',
        microchipNumber2: '4567',
        name: 'Fido',
        breed: 'XL Bully',
        sex: 'Male',
        dateOfBirth: new Date('2020-01-01'),
        colour: 'White',
        status: 'In breach',
        breaches: ['Reason 1', 'Reason 2']
      }
    }

    await sendMessage(cdo, user)

    expect(MessageSender).toHaveBeenCalledTimes(1)
    expect(MessageSender.prototype.sendMessage).toHaveBeenCalledWith({
      body: {
        certificateId: '1234',
        exemptionOrder: 2015,
        owner: {
          name: 'Joe Bloggs',
          address: {
            line1: '12 Test Street',
            line2: '',
            line3: 'Test City',
            postcode: 'TST 1AA',
            country: 'England'
          },
          birthDate: undefined,
          organisationName: 'Test org'
        },
        dog: {
          indexNumber: 'ED1234',
          microchipNumber: '1234',
          microchipNumber2: '4567',
          name: 'Fido',
          breed: 'XL Bully',
          sex: 'Male',
          birthDate: new Date('2020-01-01'),
          colour: 'White'
        },
        exemption: {
          status: 'In breach',
          breachReasons: ['Reason 1', 'Reason 2'],
          cdoIssued: new Date(2024, 11, 12),
          cdoExpiry: new Date(2025, 1, 12),
          certificateIssued: new Date(2024, 11, 20),
          insuranceRenewal: undefined,
          exemptionOrder: 2015
        },
        user: {
          username: 'test@example.com',
          displayname: undefined
        }
      },
      type: 'uk.gov.defra.aphw.ddi.download.requested',
      source: 'aphw-ddi-enforcement'
    })
    expect(MessageSender.prototype.closeConnection).toHaveBeenCalled()
  })
})
