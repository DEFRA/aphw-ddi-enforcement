const addHeaders = (user, request) => {
  const encodedCreds = Buffer.from(`${user?.username}:${user?.token}`).toString('base64')
  return {
    'ddi-username': user?.username, 'ddi-displayname': user?.displayname, Authorization: `Basic ${encodedCreds}`
  }
}

module.exports = {
  addHeaders
}
