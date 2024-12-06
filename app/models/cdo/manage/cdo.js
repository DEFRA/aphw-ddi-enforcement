const { mapManageCdoDetails } = require('../../mappers/manage-cdo')
const { tasks, progressTasks } = require('../../../constants/cdo')
const { getTaskDetails } = require('../../../routes/cdo/manage/tasks/generic-task-helper')
const { formatToGdsShort, formatToGds } = require('../../../lib/date-helpers')

const getTaskStatus = task => {
  if (task.key === tasks.applicationPackSent) {
    return task.completed ? 'Sent' : 'Not sent'
  }

  if (task.key === tasks.certificateIssued) {
    return 'Not sent'
  }

  return task.completed ? 'Received' : 'Not received'
}

const getTaskCompletedDate = task => {
  return task.completed ? task.timestamp : undefined
}

const NOT_RECEIVED_TAG = '<span class="defra-secondary-text">Not received</span>'
const GOVUK_ONE_HALF = 'govuk-!-width-one-half'

const showValOrNotEnteredObj = val => val ? ({ text: val }) : ({ html: NOT_RECEIVED_TAG })

const breadcrumbs = [
  {
    label: 'Home',
    link: '/'
  }
]

/**
 * @param modelDetails
 * @returns {GovukSummaryList[]}
 */
const getSummaries = modelDetails => {
  return [
    {
      classes: 'defra-responsive-!-font-size-16',
      rows: [
        {
          key: {
            text: 'Dog name',
            classes: GOVUK_ONE_HALF
          },
          value: showValOrNotEnteredObj(modelDetails.summary.dogName)
        },
        {
          key: {
            text: 'Owner name',
            classes: GOVUK_ONE_HALF
          },
          value: showValOrNotEnteredObj(modelDetails.summary.ownerName)
        }
      ]
    },
    {
      classes: 'defra-responsive-!-font-size-16',
      rows: [
        {
          key: {
            text: 'Microchip number',
            classes: GOVUK_ONE_HALF
          },
          value: {
            html: [modelDetails.summary.microchipNumber || NOT_RECEIVED_TAG, modelDetails.summary.microchipNumber2].join('<br>'),
            classes: GOVUK_ONE_HALF
          }
        },
        {
          key: {
            text: 'CDO expiry',
            classes: GOVUK_ONE_HALF
          },
          value: {
            text: formatToGdsShort(modelDetails.summary.cdoExpiry),
            classes: GOVUK_ONE_HALF
          }
        }
      ]
    }
  ]
}

const getStatusTag = (tasklist, task) => {
  let status = getTaskStatus(tasklist.tasks[task])

  if (status === 'Received' && task === tasks.form2Sent) {
    status = getTaskStatus(tasklist.tasks[tasks.verificationDateRecorded])
  }
  const completedDate = formatToGds(getTaskCompletedDate(tasklist.tasks[task]))

  const notComplete = status === 'Not sent' || status === 'Not received'

  const statusTag = {}

  if (notComplete) {
    statusTag.html = `<strong class="govuk-tag govuk-tag--grey">${status}</strong>`
  } else if (status === 'Sent') {
    statusTag.text = status === 'Sent' && completedDate ? `${status} on ${completedDate}` : status
  } else {
    statusTag.text = status === 'Received' && completedDate ? `${status} on ${completedDate}` : status
  }
  return statusTag
}

/**
 * @param {CdoTaskListDto} tasklist
 * @param cdo
 * @param backNav
 * @constructor
 */
function ViewModel (tasklist, cdo, backNav) {
  const modelDetails = mapManageCdoDetails(tasklist, cdo)

  /**
   * @type {GovukSummaryList[]}
   */
  const summaries = getSummaries(modelDetails)

  this.model = {
    breadcrumbs,
    backLink: backNav.backLink,
    srcHashParam: backNav.srcHashParam,
    details: modelDetails,
    dog: cdo.dog,
    summaries,
    taskList:
      Object.keys(tasklist.tasks).reduce((taskListAcc, task) => {
        if (!progressTasks.includes(task)) {
          return taskListAcc
        }

        const { label } = getTaskDetails(task)

        const statusTag = getStatusTag(tasklist, task)

        const taskProperties = {
          title: {
            text: label
          },
          status: {
            ...statusTag
          }
        }

        return {
          ...taskListAcc,
          items: [
            ...taskListAcc.items,
            taskProperties
          ]
        }
      }, {
        items: []
      })
  }
}

module.exports = ViewModel
