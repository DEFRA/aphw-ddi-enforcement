const { routes, views } = require('../../../constants/cdo/dog')
const { routes: formRoutes } = require('../../../constants/forms')
const { sources: activitySources } = require('../../../constants/cdo/activity')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/check-activities')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { getDogOwner } = require('../../../api/ddi-index-api/dog')
const { getPersonByReference } = require('../../../api/ddi-index-api/person')
const { getEvents } = require('../../../api/ddi-events-api/event')
const { getMainReturnPoint } = require('../../../lib/back-helpers')
const { sortEventsDesc, filterEvents } = require('../../../models/sorting/event')
const { getUser } = require('../../../auth')
const { licenceNotYetAccepted } = require('../../../lib/route-helpers')

const getSourceEntity = async (pk, source, user) => {
  if (source === activitySources.dog) {
    return getCdo(pk, user)
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
        console.log('check1')
        const user = getUser(request)
        console.log('check2', user)
        const pk = request.params.pk
        const source = request.params.source

        if (await licenceNotYetAccepted(request, user)) {
          return h.redirect(formRoutes.secureAccessLicence.get)
        }

        const entity = await getSourceEntity(pk, source, user)
        if (entity === null || entity === undefined) {
          return h.response().code(404).takeover()
        }

        const eventPkList = await getEventPkList(pk, source, user)

        const allEvents = await getEvents(eventPkList)

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

        return h.view(views.viewDogActivities, new ViewModel(sourceEntity, sortedActivities, backNav))
      }
    }
  }
]
