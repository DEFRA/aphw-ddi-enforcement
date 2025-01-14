const { auth, user } = require('../../../../../mocks/auth')

describe('View download', () => {
  jest.mock('../../../../../../app/auth')
  const mockAuth = require('../../../../../../app/auth')

  jest.mock('../../../../../../app/auth/get-user')
  const getUser = require('../../../../../../app/auth/get-user')

  jest.mock('../../../../../../app/api/ddi-index-api/cdo')
  const { getCdo } = require('../../../../../../app/api/ddi-index-api/cdo')

  jest.mock('../../../../../../app/lib/download-helper')
  const { getHistoryForDownload } = require('../../../../../../app/lib/download-helper')

  jest.mock('../../../../../../app/storage/repos/document')
  const { downloadDocument } = require('../../../../../../app/storage/repos/document')

  jest.mock('../../../../../../app/messaging/outbound/download')
  const { sendMessage } = require('../../../../../../app/messaging/outbound/download')

  const createServer = require('../../../../../../app/server')
  let server

  beforeEach(async () => {
    mockAuth.getUser.mockReturnValue(user)
    getUser.mockReturnValue(user)
    getHistoryForDownload.mockResolvedValue([])

    server = await createServer()
    await server.initialize()
  })

  describe('GET /cdo/view/download', () => {
    test('GET /cdo/view/download route returns 200', async () => {
      const options = {
        method: 'GET',
        url: '/cdo/view/download/ED123',
        auth
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
    })
  })

  describe('POST /cdo/view/download', () => {
    test('POST /cdo/view/download route returns 200', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadDocument.mockResolvedValue('document')
      sendMessage.mockResolvedValue(12345)

      const options = {
        method: 'POST',
        url: '/cdo/view/download/ED123',
        auth,
        payload: {
          indexNumber: 'ED123'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(200)
      expect(response.headers['content-type']).toBe('application/pdf')
    })

    test('POST /cdo/view/download route returns 404 given no cdo exists', async () => {
      getCdo.mockResolvedValue(undefined)

      const options = {
        method: 'POST',
        url: '/cdo/view/download/ED123',
        auth,
        payload: {
          indexNumber: 'ED123'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('POST /cdo/view/download route returns 400 given invalid payload', async () => {
      const options = {
        method: 'POST',
        url: '/cdo/view/download/ED123',
        auth,
        payload: {}
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(400)
    })

    test('POST /cdo/view/download route returns 404 when download not found', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadDocument.mockRejectedValue({ type: 'DocumentNotFound' })
      sendMessage.mockResolvedValue(12345)

      const options = {
        method: 'POST',
        url: '/cdo/view/download/ED123',
        auth,
        payload: {
          indexNumber: 'ED123'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(404)
    })

    test('POST /cdo/view/download route returns 500 given server error', async () => {
      getCdo.mockResolvedValue({ dog: { indexNumber: 'ED123' } })
      downloadDocument.mockRejectedValue(new Error('server error'))
      sendMessage.mockResolvedValue(12345)

      const options = {
        method: 'POST',
        url: '/cdo/view/download/ED123',
        auth,
        payload: {
          indexNumber: 'ED123'
        }
      }

      const response = await server.inject(options)

      expect(response.statusCode).toBe(500)
    })
  })

  afterEach(async () => {
    jest.clearAllMocks()
    await server.stop()
  })
})
