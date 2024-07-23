const addHeaders = (user) => ({
  'ddi-username': user?.username, 'ddi-displayname': user?.displayname
})

module.exports = {
  addHeaders
}
