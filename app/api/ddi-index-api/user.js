const { get, callDelete, put, post } = require('./base')
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
const isLicenceAccepted = async (user) => {
  const { result } = await get(endpoint + '/licence', user)
  return result
}

/**
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
*/
const setLicenceAccepted = async (user) => {
  const { result } = await put(endpoint + '/licence', {}, user)
  return result
}

/**
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
* @return {Promise<boolean>}
*/
const isEmailVerified = async (user) => {
  const { result } = await get(endpoint + '/email', user)
  return result
}

/**
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
*/
const sendVerifyEmail = async (user) => {
  return put(endpoint + '/email', {}, user)
}

/**
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
* @return {Promise<string>}
*/
const isCodeCorrect = async (user, code) => {
  const { result } = await post(endpoint + '/email', { code }, user)
  return result
}

/**
 * @param data
 * @param {{
*    username: string;
*    accessToken: string;
*    displayname: string;
* }} user
*/
const submitFeedback = async (data, user) => {
  await post(endpoint + '/feedback', data, user)
}

module.exports = {
  userLogout,
  validateUser,
  isLicenceAccepted,
  setLicenceAccepted,
  isEmailVerified,
  sendVerifyEmail,
  isCodeCorrect,
  submitFeedback
}
