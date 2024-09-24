const { get, callDelete, put } = require('./base')
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

/**
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
* @return {Promise<boolean>}
*/
const validateLicence = async (user) => {
  return get(endpoint + '/licence', user)
}

/**
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
*/
const setLicenceAccepted = async (user) => {
  return put(endpoint + '/licence', {}, user)
}

module.exports = {
  userLogout,
  validateUser,
  validateLicence,
  setLicenceAccepted
}
