const getUser = require('../../../app/auth/get-user')
const MOCK_USER_ID = 'mock-user-id'
const MOCK_DISPLAY_NAME = 'mock-display-name'
const MOCK_USERNAME = 'mock-username'
let request

describe('is in role', () => {
  beforeEach(() => {
    request = {
      auth: {
        credentials: {
          account: {
            userId: MOCK_USER_ID,
            displayname: MOCK_DISPLAY_NAME,
            username: MOCK_USERNAME
          }
        }
      }
    }
  })

  test('should return userId', () => {
    const result = getUser(request)
    expect(result.userId).toBe(MOCK_USER_ID)
  })

  test('should return display name', () => {
    const result = getUser(request)
    expect(result.displayname).toBe(MOCK_DISPLAY_NAME)
  })

  test('should return account username as username', () => {
    const result = getUser(request)
    expect(result.username).toBe(MOCK_USERNAME)
  })
})
