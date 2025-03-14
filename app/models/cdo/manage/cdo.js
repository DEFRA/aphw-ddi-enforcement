const { mapManageCdoDetails } = require('../../mappers/manage-cdo')
const { tasks, progressTasks } = require('../../../constants/cdo')
const { getTaskDetails } = require('../../../routes/cdo/manage/tasks/generic-task-helper')
const { formatToGds } = require('../../../lib/date-helpers')
const { concatUrlParams } = require('../../../lib/route-helpers/shared')
const { routes } = require('../../../constants/cdo/index')
const { routes: { searchBasic } } = require('../../../constants/search')

const getTaskStatus = (tasklist, task) => {
  if (task.key === tasks.applicationPackSent) {
    return task.completed ? 'Sent' : 'Not sent'
  }

  if (task.key === tasks.certificateIssued) {
    return 'Not sent'
  }

  if (task.key === tasks.verificationDateRecorded && tasklist.form2Submitted) {
    return 'Received'
  }

  return task.completed ? 'Received' : 'Not received'
}

const getTaskCompletedDate = (processCdoTasklist, task) => {
  const completedDate = task.timestamp

  if (task.key === tasks.verificationDateRecorded && !completedDate) {
    return formatToGds(processCdoTasklist.form2Submitted)
  }

  if (!task.completed) {
    return undefined
  }

  return formatToGds(completedDate)
}

const NOT_RECEIVED_TAG = '<span class="defra-secondary-text">Not received</span>'
const GOVUK_ONE_HALF = 'govuk-!-width-one-half'

const showValOrNotEnteredObj = val => val ? ({ text: val }) : ({ html: NOT_RECEIVED_TAG })

const breadcrumbs = [
  {
    label: 'Home',
    link: searchBasic.get
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
            text: formatToGds(modelDetails.summary.cdoExpiry),
            classes: GOVUK_ONE_HALF
          }
        }
      ]
    }
  ]
}

const getStatusTag = (tasklist, task, cdo, backNav) => {
  const status = getTaskStatus(tasklist, tasklist.tasks[task])
  const completedDate = getTaskCompletedDate(tasklist, tasklist.tasks[task])

  const notComplete = status === 'Not sent' || status === 'Not received'

  const statusTag = { classes: 'govuk-!-padding-bottom-0' }

  if (task === tasks.verificationDateRecorded && notComplete) {
    statusTag.html = `<a href="${routes.manageCdoTaskBase.get}/submit-form-two/${cdo.dog.indexNumber}${concatUrlParams(backNav.srcHashParam, 'clear=true')}" role="button" draggable="false" class="govuk-button govuk-!-margin-top-1 govuk-!-margin-bottom-1" data-module="govuk-button">Submit Form 2</a>`
  } else if (notComplete) {
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
    summaryList: Object.keys(tasklist.tasks).reduce((taskListAcc, task) => {
      if (!progressTasks.includes(task)) {
        return taskListAcc
      }

      const { label } = getTaskDetails(task)
      let key = { text: label, classes: 'govuk-!-width-one-half' }

      if (task === tasks.verificationDateRecorded) {
        key = { text: label, classes: 'govuk-!-padding-right-9' }
      }

      const statusTag = getStatusTag(tasklist, task, cdo, backNav)

      const taskProperties = {
        key,
        value: {
          ...statusTag
        }
      }

      return {
        ...taskListAcc,
        rows: [
          ...taskListAcc.rows,
          taskProperties
        ]
      }
    }, { rows: [], classes: 'cdo-progress-summary-list' })
  }
}

module.exports = ViewModel
