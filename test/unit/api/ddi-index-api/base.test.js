const { user, userWithDisplayname } = require('../../../mocks/auth')
const wreck = require('@hapi/wreck')
const { ApiErrorFailure } = require('../../../../app/errors/api-error-failure')
jest.mock('@hapi/wreck')

describe('Base API', () => {
  const { get, put, post, callDelete, boomRequest } = require('../../../../app/api/ddi-index-api/base')
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

  describe('POST', () => {
    test('post should call POST', async () => {
      await post('endpoint2', { val: 123 })
      expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 } })
    })

    test('post should call POST with username in header', async () => {
      await post('endpoint2', { val: 123 }, user)
      expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })

    test('post should not fail given an empty payload', async () => {
      wreck.post.mockResolvedValue({ payload: { toString () { return '' } } })
      await post('endpoint2', { val: 123 }, user)
      expect(wreck.post).toHaveBeenCalledWith('test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
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

  describe('Boom Request', () => {
    test('boomRequest should call request PUT', async () => {
      const res = await boomRequest('endpoint2', 'PUT', { val: 123 })
      expect(wreck.read).toBeCalledWith({ statusCode: 200, statusMessage: 'Ok', payload: Buffer.from('{"resultCode": 200}') })
      expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
      expect(wreck.request).toHaveBeenCalledWith('PUT', 'test/endpoint2', { payload: { val: 123 } })
    })

    test('should not fail given an empty payload', async () => {
      wreckReadToString.mockReturnValue('')
      const response = await boomRequest('endpoint2', { val: 123 }, user)
      expect(response.payload).toBeUndefined()
    })

    test('postWithBoom should return a valid error object if request failed', async () => {
      wreck.request.mockResolvedValue({ statusCode: 409, statusMessage: 'Conflict', payload: Buffer.from('{"error":"Username already exists","message":"Username already exists","statusCode":409}') })
      wreckReadToString.mockReturnValue(JSON.stringify({ error: 'Username already exists', message: 'Username already exists', statusCode: 409 }))
      wreck.read.mockResolvedValue({ toString: wreckReadToString })
      await expect(boomRequest('endpoint2', 'PUT', { val: 123 })).rejects.toThrow(new ApiErrorFailure('409 Conflict', { error: 'Username already exists', message: 'Username already exists', statusCode: 409 }))
    })

    test('postWithBoom should call request PUT with username in header', async () => {
      const res = await boomRequest('endpoint2', 'PUT', { val: 123 }, user)
      expect(res).toEqual({ statusCode: 200, statusMessage: 'Ok', payload: { result: 'ok' } })
      expect(wreck.request).toHaveBeenCalledWith('PUT', 'test/endpoint2', { payload: { val: 123 }, headers: { 'ddi-username': 'test@example.com', Authorization: expect.any(String) } })
    })
  })
})
