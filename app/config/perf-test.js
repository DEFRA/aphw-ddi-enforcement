const perftest478 = 'perftest478@defratest.org.uk'
const perftest479 = 'perftest479@defratest.org.uk'
const perftest480 = 'perftest480@defratest.org.uk'
const perftest481 = 'perftest481@defratest.org.uk'
const perftest482 = 'perftest482@defratest.org.uk'

const userPicker = [
  perftest478,
  perftest479,
  perftest480,
  perftest481,
  perftest482
]

const userMap = {
  [perftest478]: {
    id: 'e7ebd08f-fd26-4014-bd41-d1a2e32c3a7d',
    username: perftest478,
    displayname: perftest478,
    accessToken: 'OHg3RAGWwpJlTMutiQUjLs4cFpEvLMezBX034VMayYOOYmZ9iDrfKm7XrbTM45ps'
  },
  [perftest479]: {
    id: '99a3a57d-cbe8-4820-a7ae-217d7ae379de',
    username: 'perftest479',
    displayname: 'perftest479',
    accessToken: 'hP8CrPATbpmwKy0li4K6sd5OszwKATz3qXaYl3RTGbGLYhhyxRpaEvgRfOAURxef'
  },
  [perftest480]: {
    id: '5ebab0cf-fbe7-48e4-854c-0b53cbb8bd0e',
    username: perftest480,
    displayname: perftest480,
    accessToken: 'WO8tdcuqclO3lKPpucvxAGMmjTAopAeeFlHGwgETFT0d7kV4fdkIJXImDSaBRyU5'
  },
  [perftest481]: {
    id: 'dd66ceb0-3bb3-4252-8da7-ef85bd854097',
    username: perftest481,
    displayname: perftest481,
    accessToken: 'qf6RlCa2ES4HWmw8iLvCqz1FzH9GRWAAeB202ppytUuRjlYlHir00kcBIyZEj9J0'
  },
  [perftest482]: {
    id: '15b59dd6-4b85-47f9-b85d-a1d9ec6b9689',
    username: perftest482,
    displayname: perftest482,
    accessToken: 'EP7FmxeaCDZWUkC4xghaG9vlHcY06MJCuacJC6s51xUFtzXo5ULxB3UTlse9SQTB'
  }
}
/**
 * @typedef {{id: string, displayname: string, accessToken: string, username: string}} PerfUser
 */
/**
 * @type {{
 *  'perftest479@defratest.org.uk': PerfUser,
 *  'perftest481@defratest.org.uk': PerfUser,
 *  'perftest480@defratest.org.uk': PerfUser,
 *  'perftest478@defratest.org.uk': PerfUser,
 *  'perftest482@defratest.org.uk': PerfUser,
 *  randomise: (() => PerfUser),
 *  users: string[]
 * }}
 */
module.exports = {
  ...userMap,
  users: userPicker,
  randomise: () => {
    const email = userPicker[Math.floor(Math.random() * userPicker.length)]
    return userMap[email]
  }
}
