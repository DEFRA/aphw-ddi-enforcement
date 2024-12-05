const { mapManageCdoDetails } = require('../../mappers/manage-cdo')
const { tasks, progressTasks } = require('../../../constants/cdo')
const { getTaskDetails } = require('../../../routes/cdo/manage/tasks/generic-task-helper')
const { formatToGdsShort, formatToGds } = require('../../../lib/date-helpers')

const getTaskStatus = task => {
  if (task.key === tasks.applicationPackSent) {
    return task.completed ? 'Sent' : 'Not sent'
  }

  return task.completed ? 'Received' : 'Not received'
}

const getTaskCompletedDate = task => {
  return task.completed ? task.timestamp : undefined
}

const NOT_RECEIVED_TAG = '<span class="defra-secondary-text">Not received</span>'

const showValOrNotEnteredObj = val => val ? ({ text: val }) : ({ html: NOT_RECEIVED_TAG })
/**
 * @param {CdoTaskListDto} tasklist
 * @param cdo
 * @param backNav
 * @constructor
 */
function ViewModel (tasklist, cdo, backNav) {
  const breadcrumbs = [
    {
      label: 'Home',
      link: '/'
    }
  ]

  const modelDetails = mapManageCdoDetails(tasklist, cdo)

  /**
   * @type {GovukSummaryList[]}
   */
  const summaries = [
    {
      classes: 'defra-responsive-!-font-size-16',
      rows: [
        {
          key: {
            text: 'Dog name',
            classes: 'govuk-!-width-one-half'
          },
          value: showValOrNotEnteredObj(modelDetails.summary.dogName)
        },
        {
          key: {
            text: 'Owner name',
            classes: 'govuk-!-width-one-half'
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
            classes: 'govuk-!-width-one-half'
          },
          value: {
            html: [modelDetails.summary.microchipNumber || NOT_RECEIVED_TAG, modelDetails.summary.microchipNumber2].join('<br>'),
            classes: 'govuk-!-width-one-half'
          }
        },
        {
          key: {
            text: 'CDO expiry',
            classes: 'govuk-!-width-one-half'
          },
          value: {
            text: formatToGdsShort(modelDetails.summary.cdoExpiry),
            classes: 'govuk-!-width-one-half'
          }
        }
      ]
    }
  ]

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
          statusTag.text = status === 'Sent' ? `${status} on ${completedDate}` : status
        } else {
          statusTag.text = status === 'Received' && completedDate ? `${status} on ${completedDate}` : status
        }

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
