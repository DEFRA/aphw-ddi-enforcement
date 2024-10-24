const userPicker = [
  'perftest478@defratest.org.uk',
  'perftest479@defratest.org.uk',
  'perftest480@defratest.org.uk',
  'perftest481@defratest.org.uk',
  'perftest482@defratest.org.uk'
]

const userMap = {
  'perftest478@defratest.org.uk': {
    id: 'e7ebd08f-fd26-4014-bd41-d1a2e32c3a7d',
    username: 'perftest478@defratest.org.uk',
    displayname: 'perftest478@defratest.org.uk',
    accessToken: 'OHg3RAGWwpJlTMutiQUjLs4cFpEvLMezBX034VMayYOOYmZ9iDrfKm7XrbTM45ps'
  },
  'perftest479@defratest.org.uk': {
    id: '99a3a57d-cbe8-4820-a7ae-217d7ae379de',
    username: 'perftest479@defratest.org.uk',
    displayname: 'perftest479@defratest.org.uk',
    accessToken: 'hP8CrPATbpmwKy0li4K6sd5OszwKATz3qXaYl3RTGbGLYhhyxRpaEvgRfOAURxef'
  },
  'perftest480@defratest.org.uk': {
    id: '5ebab0cf-fbe7-48e4-854c-0b53cbb8bd0e',
    username: 'perftest480@defratest.org.uk',
    displayname: 'perftest480@defratest.org.uk',
    accessToken: 'WO8tdcuqclO3lKPpucvxAGMmjTAopAeeFlHGwgETFT0d7kV4fdkIJXImDSaBRyU5'
  },
  'perftest481@defratest.org.uk': {
    id: 'dd66ceb0-3bb3-4252-8da7-ef85bd854097',
    username: 'perftest481@defratest.org.uk',
    displayname: 'perftest481@defratest.org.uk',
    accessToken: 'qf6RlCa2ES4HWmw8iLvCqz1FzH9GRWAAeB202ppytUuRjlYlHir00kcBIyZEj9J0'
  },
  'perftest482@defratest.org.uk': {
    id: '15b59dd6-4b85-47f9-b85d-a1d9ec6b9689',
    username: 'perftest482@defratest.org.uk',
    displayname: 'perftest482@defratest.org.uk',
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
