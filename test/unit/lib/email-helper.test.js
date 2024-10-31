const { user } = require('../../mocks/auth')
const { buildReportSomethingPayload } = require('../../../app/lib/email-helper')

describe('Email helper', () => {
  test('should handle in-breach for dog source', () => {
    const data = {
      reportType: 'in-breach',
      sourceType: 'dog',
      pk: 'ED12345',
      dogBreaches: [
        'breach 1',
        'breach 2'
      ]
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Breach reported for Dog ED12345\nReasons:\n - breach 1\n - breach 2\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle in-breach for dog source where user selects reason not listed', () => {
    const data = {
      reportType: 'in-breach',
      sourceType: 'dog',
      pk: 'ED12345',
      details: 'Example text for details'
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Breach reported for Dog ED12345\nReasons:\nExample text for details\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle in-breach for owner source', () => {
    const data = {
      reportType: 'in-breach',
      sourceType: 'owner',
      pk: 'P-123',
      dogBreaches: [
        'breach 1',
        'breach 2'
      ],
      dogChosen: { indexNumber: 'ED12300' }
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Breach reported for Dog ED12300\nReasons:\n - breach 1\n - breach 2\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle changed-address for dog source', () => {
    const data = {
      reportType: 'changed-address',
      sourceType: 'dog',
      pk: 'ED12345',
      addressLine1: 'addr1',
      addressLine2: 'addr2',
      town: 'town',
      postcode: 'postcode',
      country: 'country'
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Change of address reported for Dog ED12345\nNew address:\n    addr1\n    addr2\n    town\n    postcode\n    country\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle changed-address for owner source - single dog', () => {
    const data = {
      reportType: 'changed-address',
      sourceType: 'owner',
      pk: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      addressLine1: 'addr1',
      addressLine2: 'addr2',
      town: 'town',
      postcode: 'postcode',
      country: 'country',
      dogs: ['ED45600']
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Change of address reported for John Smith (owns dog ED45600)\nNew address:\n    addr1\n    addr2\n    town\n    postcode\n    country\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle changed-address for owner source - multiple dogs', () => {
    const data = {
      reportType: 'changed-address',
      sourceType: 'owner',
      pk: 'P-123',
      firstName: 'John',
      lastName: 'Smith',
      addressLine1: 'addr1',
      addressLine2: 'addr2',
      town: 'town',
      postcode: 'postcode',
      country: 'country',
      dogs: ['ED12300', 'ED45600']
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Change of address reported for John Smith (owns dogs ED12300, ED45600)\nNew address:\n    addr1\n    addr2\n    town\n    postcode\n    country\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle dog-died for dog source', () => {
    const data = {
      reportType: 'dog-died',
      sourceType: 'dog',
      pk: 'ED12300',
      dateOfDeath: new Date(2024, 5, 25)
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Dog ED12300 has died\nDate of death: 25/06/2024\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle dog-died for owner source', () => {
    const data = {
      reportType: 'dog-died',
      sourceType: 'owner',
      pk: 'P-123',
      dateOfDeath: new Date(2024, 5, 25),
      dogChosen: { indexNumber: 'ED12300' }
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Dog ED12300 has died\nDate of death: 25/06/2024\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle something-else for dog source', () => {
    const data = {
      reportType: 'something-else',
      sourceType: 'dog',
      pk: 'ED12300',
      details: 'Example text'
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Something else for Dog ED12300\nDetails: Example text\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle something-else for owner source - single dog', () => {
    const data = {
      reportType: 'something-else',
      sourceType: 'owner',
      pk: 'P-123',
      details: 'Example text',
      dogs: ['ED12300'],
      firstName: 'John',
      lastName: 'Smith'
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Something else for John Smith (owns dog ED12300)\nDetails: Example text\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })

  test('should handle something-else for owner source - multiple dogs', () => {
    const data = {
      reportType: 'something-else',
      sourceType: 'owner',
      pk: 'P-123',
      details: 'Example text',
      dogs: ['ED12300', 'ED45600'],
      firstName: 'John',
      lastName: 'Smith'
    }
    const res = buildReportSomethingPayload(data, user)
    expect(res).toEqual({
      fields: [
        { name: 'Details', value: 'Something else for John Smith (owns dogs ED12300, ED45600)\nDetails: Example text\n' },
        { name: 'ReportedBy', value: user.username }
      ],
      reportData: data
    })
  })
})
