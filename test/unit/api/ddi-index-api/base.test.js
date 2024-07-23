const { user } = require('../../../mocks/auth')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get } = require('../../../../app/api/ddi-index-api/base')
  const wreckReadToString = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    wreckReadToString.mockReturnValue(JSON.stringify({ result: 'ok' }))
    wreck.get.mockResolvedValue({ payload: { result: 'ok' } })
    wreck.post.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.put.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.delete.mockResolvedValue({ payload: '{"resultCode": 200}' })
    wreck.request.mockResolvedValue({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
    wreck.read.mockResolvedValue({ toString: wreckReadToString })
  })

  describe('GET', () => {
    test('get should call GET', async () => {
      await get('endpoint1')
      expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', { json: true })
    })

    test('get should call GET with username in header', async () => {
      await get('endpoint1', user)
      expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', { json: true, headers: { 'ddi-username': 'test@example.com' } })
    })
  })
})
