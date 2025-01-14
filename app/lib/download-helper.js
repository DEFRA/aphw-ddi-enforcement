const { getEvents } = require('../api/ddi-events-api/event')
const { getDogOwner } = require('../api/ddi-index-api/dog')
const { sortEventsDesc, filterEvents } = require('../models/sorting/event')
const { sources: activitySources } = require('../constants/cdo/activity')
const { flatMapActivityDtoToCheckActivityRow } = require('../models/mappers/check-history')

const getHistoryForDownload = async (indexNumber, user) => {
  const { personReference } = await getDogOwner(indexNumber, user)

  const allEvents = await getEvents([indexNumber, personReference], user)

  const sourceEntity = {
    pk: indexNumber,
    source: activitySources.dog,
    indexNumber
  }

  const filteredEvents = filterEvents(allEvents, sourceEntity)

  const sortedEvents = sortEventsDesc(filteredEvents)

  const mappedActivities = flatMapActivityDtoToCheckActivityRow(sortedEvents).map(x => ({
    date: x.date,
    activityLabel: x.activityLabel,
    childList: x.childList
  }))

  return mappedActivities
}

module.exports = {
  getHistoryForDownload
}
