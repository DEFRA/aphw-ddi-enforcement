const { routes, views } = require('../../../../constants/cdo/index')
const { cdoTasksGetSchema } = require('../../../../schema/portal/cdo/tasks/generic-task')
const getUser = require('../../../../auth/get-user')
const { addDateComponents } = require('../../../../lib/date-helpers')
const { createModel, getTaskData, getValidation, getTaskDetailsByKey } = require('./generic-task-helper')
const { addBackNavigation, addBackNavigationForErrorCondition } = require('../../../../lib/back-helpers')
const { saveCdoTaskDetails, getCdo } = require('../../../../api/ddi-index-api/cdo')
const { logValidationError } = require('../../../../lib/log-helpers')
const { setVerificationPayload, clearVerificationPayload } = require('../../../../session/cdo/manage')
const { useManageCdo } = require('../../../../lib/route-helpers')
const { errorCodes } = require('../../../../constants/forms')

module.exports = [
  {
    method: 'GET',
    path: `${routes.manageCdoTaskBase.get}/{taskName}/{dogIndex?}`,
    options: {
      validate: {
        params: cdoTasksGetSchema
      },
      handler: async (request, h) => {
        const taskName = request.params.taskName
        const dogIndex = request.params.dogIndex
        const queryParams = request.query

        if (taskName && queryParams.clear) {
          clearVerificationPayload(request)
          return h.redirect(`${routes.manageCdoTaskBase.get}/${taskName}/${dogIndex}?src=${queryParams.src}`)
        }

        const user = getUser(request)
        const cdo = await getCdo(dogIndex, user)

        if (!useManageCdo(cdo)) {
          throw new Error(`Dog ${dogIndex} is wrong status for manage-cdo`)
        }

        const data = await getTaskData(dogIndex, taskName, user, request)
        const backNav = addBackNavigation(request)

        addDateComponents(data, 'insuranceRenewal')
        addDateComponents(data, 'applicationFeePaid')
        addDateComponents(data, 'microchipVerification')
        addDateComponents(data, 'neuteringConfirmation')
        addDateComponents(data, 'microchipDeadline')

        return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.manageCdoTaskBase.get}/{taskName}/{dogIndex?}`,
    options: {
      validate: {
        options: {
          abortEarly: false
        },
        params: cdoTasksGetSchema,
        payload: function (payload) {
          return getValidation(payload)
        },
        failAction: async (request, h, error) => {
          const user = getUser(request)
          const taskName = request.params.taskName
          logValidationError(error, `${routes.manageCdoTaskBase.get} ${taskName}`)

          const data = await getTaskData(request.params.dogIndex, taskName, user, request, request.payload)

          const backNav = addBackNavigationForErrorCondition(request)

          return h.view(`${views.taskViews}/${taskName}`, createModel(taskName, data, backNav, error)).code(errorCodes.validationError).takeover()
        }
      },
      handler: async (request, h) => {
        const dogIndex = request.params.dogIndex
        const taskName = request.params.taskName
        const payload = request.payload
        const user = getUser(request)

        const { apiKey } = getTaskDetailsByKey(taskName)

        if (taskName === 'submit-form-two' && payload.dogNotFitForMicrochip === true) {
          const backNav = addBackNavigation(request)
          setVerificationPayload(request, payload)
          return h.redirect(`${routes.manageCdoRecordMicrochipDeadline.get}/${dogIndex}${backNav.srcHashParam}`)
        }

        await saveCdoTaskDetails(dogIndex, apiKey, payload, user)

        if (['submit-form-two', 'record-microchip-deadline'].includes(taskName)) {
          clearVerificationPayload(request)
        }

        return h.redirect(`${routes.manageCdo.get}/${dogIndex}`)
      }
    }
  }
]
