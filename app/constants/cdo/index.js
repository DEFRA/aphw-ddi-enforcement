const applicationPackSent = 'applicationPackSent'
const insuranceDetailsRecorded = 'insuranceDetailsRecorded'
const microchipNumberRecorded = 'microchipNumberRecorded'
const applicationFeePaid = 'applicationFeePaid'
const form2Sent = 'form2Sent'
const verificationDateRecorded = 'verificationDateRecorded'
const microchipDeadlineRecorded = 'microchipDeadlineRecorded'
const certificateIssued = 'certificateIssued'

const constants = {
  routes: {
    manageCdo: {
      get: '/cdo/manage/cdo',
      post: '/cdo/manage/cdo'
    },
    manageCdoTaskBase: {
      get: '/cdo/manage/task'
    }
  },
  progressTasks: [
    applicationPackSent,
    insuranceDetailsRecorded,
    microchipNumberRecorded,
    applicationFeePaid,
    form2Sent,
    certificateIssued
  ],
  tasks: {
    applicationPackSent,
    insuranceDetailsRecorded,
    microchipNumberRecorded,
    applicationFeePaid,
    form2Sent,
    verificationDateRecorded,
    microchipDeadlineRecorded,
    certificateIssued
  },
  views: {
    manageCdo: 'cdo/manage/cdo',
    taskViews: 'cdo/manage/tasks'
  }
}

module.exports = constants
