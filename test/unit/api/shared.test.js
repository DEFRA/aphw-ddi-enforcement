describe('shared', () => {
  const { addHeaders } = require('../../../app/api/shared')

  describe('addHeaders', () => {
    const audience = 'unknown.org'
    const user = {
      username: 'user@example.com',
      displayname: 'user@example.com',
      accessToken: 'abc'
    }

    test('should add default header without user agent', () => {
      const headers = addHeaders(user)
      expect(headers).toEqual({
        'ddi-username': user?.username,
        'ddi-displayname': user?.displayname,
        Authorization: expect.any(String)
      })
      expect(headers.Authorization.startsWith('Bearer ')).toBe(true)
    })

    test('should add default header with audience', () => {
      const headers = addHeaders(user, audience)
      expect(headers).toEqual({
        'ddi-username': user?.username,
        'ddi-displayname': user?.displayname,
        Authorization: expect.any(String)
      })
    })

    test('should add default header with user agent', () => {
      const userAgent = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:131.0) Gecko/20100101 Firefox/131.0'

      const headers = addHeaders({ ...user, userAgent })
      expect(headers).toEqual({
        'ddi-username': user?.username,
        'ddi-displayname': user?.displayname,
        Authorization: expect.any(String),
        'enforcement-user-agent': userAgent
      })
    })
  })
})
