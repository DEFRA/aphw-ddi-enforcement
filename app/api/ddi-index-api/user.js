const { callDelete } = require('./base')
const endpoint = 'user/cache/my'

const userLogout = async (user) => {
  await callDelete(endpoint, user)
}

module.exports = { userLogout }
