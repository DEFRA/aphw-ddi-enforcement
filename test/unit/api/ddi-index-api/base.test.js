const { userWithDisplayname } = require('../../../mocks/auth')
const wreck = require('@hapi/wreck')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get, put, callDelete } = require('../../../../app/api/ddi-index-api/base')
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
      await get('endpoint1', userWithDisplayname)
      expect(wreck.get).toHaveBeenCalledWith('test/endpoint1', {
        json: true,
        headers: {
          'ddi-username': 'test@example.com',
          Authorization: expect.any(String),
          'ddi-displayname': 'Example Tester'
        }
      })
    })
  })

  describe('PUT', () => {
    test('put should call PUT', async () => {
      await put('endpoint1', {})
      expect(wreck.put).toHaveBeenCalledWith('test/endpoint1', { payload: {} })
    })

    test('put should call PUT with username in header', async () => {
      await put('endpoint1', { dataval: '123' }, userWithDisplayname)
      expect(wreck.put).toHaveBeenCalledWith(
        'test/endpoint1',
        {
          payload: { dataval: '123' },
          headers: {
            'ddi-username': 'test@example.com',
            Authorization: expect.any(String),
            'ddi-displayname': 'Example Tester'
          }
        })
    })
  })

  describe('DELETE', () => {
    test('delete should call DELETE', async () => {
      await callDelete('endpoint3')
      expect(wreck.delete).toHaveBeenCalledWith('test/endpoint3', { json: true })
    })

    test('delete should call DELETE with username in header', async () => {
      await callDelete('endpoint3', userWithDisplayname)
      expect(wreck.delete).toHaveBeenCalledWith('test/endpoint3', {
        json: true,
        headers: {
          'ddi-username': 'test@example.com',
          'ddi-displayname': 'Example Tester',
          Authorization: expect.any(String)
        }
      })
    })
  })
})
