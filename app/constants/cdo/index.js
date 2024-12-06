const applicationPackSent = 'applicationPackSent'
const insuranceDetailsRecorded = 'insuranceDetailsRecorded'
const microchipNumberRecorded = 'microchipNumberRecorded'
const applicationFeePaid = 'applicationFeePaid'
const form2Sent = 'form2Sent'
const verificationDateRecorded = 'verificationDateRecorded'
const microchipDeadlineRecorded = 'microchipDeadlineRecorded'
const certificateIssued = 'certificateIssued'
const submitFormTwo = 'submitFormTwo'

const constants = {
  routes: {
    manageCdo: {
      get: '/cdo/manage/cdo',
      post: '/cdo/manage/cdo'
    },
    manageCdoTaskBase: {
      get: '/cdo/manage/task'
    },
    manageCdoRecordMicrochipDeadline: {
      get: '/cdo/manage/task/record-microchip-deadline',
      post: '/cdo/manage/task/record-microchip-deadline'
    }
  },
  saveTasks: {
    submitFormTwo
  },
  progressTasks: [
    applicationPackSent,
    insuranceDetailsRecorded,
    microchipNumberRecorded,
    applicationFeePaid,
    verificationDateRecorded,
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
