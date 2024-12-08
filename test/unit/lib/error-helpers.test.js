const { errorPusherDefault, errorPusherWithDate, processPreErrorPageResponse } = require('../../../app/lib/error-helpers')

jest.mock('../../../app/session/session-wrapper')
const { clearSessionDown } = require('../../../app/session/session-wrapper')

describe('ErrorHelpers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    clearSessionDown.mockReturnValue()
  })

  test('errorPusherDefault handles no errors', () => {
    const errors = null
    const model = {}
    errorPusherDefault(errors, model)
    expect(model.errors).toBe(undefined)
  })

  test('errorPusherDefault handles single error', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherDefault(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherDefault handles single error using context-path', () => {
    const errors = { details: [{ path: [null], context: { path: ['field1'] }, message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherDefault(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherDefault doesnt add error when field not in model', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field2: '123', errors: [] }
    errorPusherDefault(errors, model)
    expect(model.errors).toEqual([])
  })

  test('errorPusherWithDate handles no errors', () => {
    const errors = null
    const model = {}
    errorPusherWithDate(errors, model)
    expect(model.errors).toBe(undefined)
  })

  test('errorPusherWithDate handles single error', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherWithDate handles single error using context-path', () => {
    const errors = { details: [{ path: [null], context: { path: ['field1'] }, message: 'Custom error message text' }] }
    const model = { field1: '123', errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([{ href: '#field1', text: 'Custom error message text' }])
  })

  test('errorPusherWithDate doesnt add error when field not in model', () => {
    const errors = { details: [{ path: ['field1'], message: 'Custom error message text' }] }
    const model = { field2: '123', errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([])
  })

  test('errorPusherWithDate handles single error when a date', () => {
    const errors = { details: [{ path: ['field1', 'month'], message: 'Custom error message text' }] }
    const model = { field1: { value: '2020-01-01', type: 'date', items: ['month'] }, errors: [] }
    errorPusherWithDate(errors, model)
    expect(model.errors).toEqual([{ href: '#field1-month', text: 'Custom error message text' }])
  })

  describe('processPreErrorPageResponse', () => {
    test('returns undefined if missing boom', () => {
      const request = { response: { } }
      const h = { view: jest.fn(), code: jest.fn() }
      const res = processPreErrorPageResponse(request, h)
      expect(res).toBe(undefined)
    })

    test('returns undefined if not boom', () => {
      const request = { response: { isBoom: false } }
      const h = { view: jest.fn(), code: jest.fn() }
      const res = processPreErrorPageResponse(request, h)
      expect(res).toBe(undefined)
    })

    test('returns view and code if 401', () => {
      const request = { response: { isBoom: true, output: { statusCode: 401 } } }
      const mockView = jest.fn()
      const mockCode = jest.fn()
      const h = {
        view: mockView.mockImplementation((v) => {
          return {
            code: mockCode.mockImplementation((c) => { return c })
          }
        })
      }
      const res = processPreErrorPageResponse(request, h)
      expect(res).toBe(401)
      expect(mockView).toHaveBeenCalledWith('unauthorized')
      expect(mockCode).toHaveBeenCalledWith(401)
    })

    test('returns view and code if 403', () => {
      const request = { response: { isBoom: true, output: { statusCode: 403 } } }
      const mockView = jest.fn()
      const mockCode = jest.fn()
      const h = {
        view: mockView.mockImplementation((v) => {
          return {
            code: mockCode.mockImplementation((c) => { return c })
          }
        })
      }
      const res = processPreErrorPageResponse(request, h)
      expect(res).toBe(403)
      expect(mockView).toHaveBeenCalledWith('unauthorized')
      expect(mockCode).toHaveBeenCalledWith(403)
    })

    test('returns view and code if 404', () => {
      const request = { response: { isBoom: true, output: { statusCode: 404 } } }
      const mockView = jest.fn()
      const mockCode = jest.fn()
      const h = {
        view: mockView.mockImplementation((v) => {
          return {
            code: mockCode.mockImplementation((c) => { return c })
          }
        })
      }
      const res = processPreErrorPageResponse(request, h)
      expect(res).toBe(404)
      expect(mockView).toHaveBeenCalledWith('404', { nav: { homeLink: '/' } })
      expect(mockCode).toHaveBeenCalledWith(404)
    })

    test('returns view and code if 500', () => {
      const request = { log: jest.fn(), response: { isBoom: true, output: { statusCode: 500 } } }
      const mockView = jest.fn()
      const mockCode = jest.fn()
      const h = {
        view: mockView.mockImplementation((v) => {
          return {
            code: mockCode.mockImplementation((c) => { return c })
          }
        })
      }
      const res = processPreErrorPageResponse(request, h)
      expect(res).toBe(500)
      expect(mockView).toHaveBeenCalledWith('500', { nav: { homeLink: '/' } })
      expect(mockCode).toHaveBeenCalledWith(500)
    })
  })
})
