const { get } = require('./base')
const { keys, sources } = require('../../constants/cdo/activity')

const activitiesEndpoint = 'activities'
const activityEndpoint = 'activity'

const getActivities = async (activityType, activitySource, user) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}/${activitySource}`, user)

  return payload.activities
}

const getAllActivities = async (user) => {
  return {
    dogSent: await getActivities(keys.sent, sources.dog, user),
    dogReceived: await getActivities(keys.received, sources.dog, user),
    ownerSent: await getActivities(keys.sent, sources.owner, user),
    ownerReceived: await getActivities(keys.received, sources.owner, user)
  }
}

const getActivityById = async (activityId, user) => {
  const payload = await get(`${activityEndpoint}/${activityId}`, user)

  return payload.activity
}

module.exports = {
  getActivities,
  getAllActivities,
  getActivityById
}
