const { get } = require('./base')
const { keys, sources } = require('../../constants/cdo/activity')

const activitiesEndpoint = 'activities'
const activityEndpoint = 'activity'

const getActivities = async (activityType, activitySource) => {
  const payload = await get(`${activitiesEndpoint}/${activityType}/${activitySource}`)

  return payload.activities
}

const getAllActivities = async () => {
  return {
    dogSent: await getActivities(keys.sent, sources.dog),
    dogReceived: await getActivities(keys.received, sources.dog),
    ownerSent: await getActivities(keys.sent, sources.owner),
    ownerReceived: await getActivities(keys.received, sources.owner)
  }
}

const getActivityById = async (activityId) => {
  const payload = await get(`${activityEndpoint}/${activityId}`)

  return payload.activity
}

module.exports = {
  getActivities,
  getAllActivities,
  getActivityById
}
