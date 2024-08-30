const { get, callDelete } = require('./base')
const endpoint = 'user/me'

const userLogout = async (user) => {
  await callDelete(endpoint + '/cache', user)
}

/**
 * @param {{
 *    username: string;
 *    accessToken: string;
 *    displayname: string;
 * }} user
 * @return {Promise<void>}
 */
const validateUser = async (user) => {
  await get(endpoint + '/validate', user)
}

module.exports = { userLogout, validateUser }
