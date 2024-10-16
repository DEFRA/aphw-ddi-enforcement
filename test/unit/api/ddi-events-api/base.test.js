const wreck = require('@hapi/wreck')
const { user } = require('../../../mocks/auth')
const addHeadersStub = require('../../../../app/api/shared')

jest.mock('@hapi/wreck')

describe('Base API', () => {
  const addHeadersSpy = jest.spyOn(addHeadersStub, 'addHeaders')

  const { get } = require('../../../../app/api/ddi-events-api/base')
  const wreckReadToString = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    wreckReadToString.mockReturnValue(JSON.stringify({ result: 'ok' }))
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.read.mockResolvedValue({ toString: wreckReadToString })
  })

  test('get should call GET with user', async () => {
    await get('endpoint1', user)
    expect(addHeadersSpy).toHaveBeenCalledWith(user, 'aphw-ddi-events')
    expect(wreck.get).toHaveBeenCalledWith('test-events/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
  })
})
