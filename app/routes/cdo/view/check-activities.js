const { routes, views } = require('../../../constants/cdo/dog')
const { sources: activitySources } = require('../../../constants/cdo/activity')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/check-activities')
const { getCdoFromActivities } = require('../../../api/ddi-index-api/cdo')
const { getDogOwner } = require('../../../api/ddi-index-api/dog')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { getEvents } = require('../../../api/ddi-events-api/event')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { sortEventsDesc, filterEvents } = require('../../../models/sorting/event')
const { getUser } = require('../../../auth')
const { getRedirectForUserAccess } = require('../../../lib/route-helpers')

const getSourceEntity = async (pk, source, user) => {
  if (source === activitySources.dog) {
    return getCdoFromActivities(pk, user)
  } else if (source === activitySources.owner) {
    return getPersonByReference(pk, user)
  }

  return null
}

const getEventPkList = async (pk, source, user) => {
  if (source === activitySources.dog) {
    const { personReference } = await getDogOwner(pk, user)
    return [pk, personReference]
  }
  return [pk]
}

module.exports = [
  {
    method: 'GET',
    path: `${routes.viewActivities.get}/{pk}/{source}`,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const user = getUser(request)
        const pk = request.params.pk
        const source = request.params.source

        console.log('~~~~~~ Chris Debug ~~~~~~ activities before', '')
        const redirectRoute = await getRedirectForUserAccess(request, user)
        if (redirectRoute) {
          return h.redirect(redirectRoute)
        }
        console.log('~~~~~~ Chris Debug ~~~~~~ activities after', '')

        const entity = await getSourceEntity(pk, source, user)
        if (entity === null || entity === undefined) {
          return h.response().code(404).takeover()
        }

        console.log('~~~~~~ Chris Debug ~~~~~~ ', 'Entity', entity)

        const eventPkList = await getEventPkList(pk, source, user)

        console.log('~~~~~~ Chris Debug ~~~~~~ ', 'EventPkList', eventPkList)
        const allEvents = await getEvents(eventPkList, user)
        console.log('~~~~~~ Chris Debug ~~~~~~ ', 'AllEvents', allEvents)

        const sourceEntity = {
          pk,
          source: request.params.source,
          title: source === activitySources.dog ? `Dog ${pk}` : `${entity.firstName} ${entity.lastName}`
        }

        const filteredEvents = filterEvents(allEvents, sourceEntity)

        const sortedActivities = sortEventsDesc(filteredEvents)

        const backNav = {
          backLink: getMainReturnPoint(request)
        }

        console.log('~~~~~~ Chris Debug ~~~~~~ 73', '')
        return h.view(views.viewDogActivities, new ViewModel(sourceEntity, sortedActivities, backNav))
      }
    }
  }
]
