const { tasks } = require('../../../../constants/cdo/index')
const { getCdoTaskDetails } = require('../../../../api/ddi-index-api/cdo')
const { getVerificationPayload } = require('../../../../session/cdo/manage')
const ViewModelRecordVerificationDates = require('../../../../models/cdo/manage/tasks/record-verification-dates')
const { validateVerificationDates } = require('../../../../schema/portal/cdo/tasks/record-verification-dates')

const taskList = [
  { name: tasks.applicationPackSent, key: 'send-application-pack', canSubmit: false, label: 'Application pack', apiKey: 'sendApplicationPack', stateKey: 'applicationPackSent' },
  { name: tasks.insuranceDetailsRecorded, key: 'record-insurance-details', canSubmit: false, label: 'Evidence of insurance', apiKey: 'recordInsuranceDetails', stateKey: 'insuranceDetailsRecorded' },
  { name: tasks.microchipNumberRecorded, key: 'record-microchip-number', canSubmit: false, label: 'Microchip number', apiKey: 'recordMicrochipNumber', stateKey: 'microchipNumberRecorded' },
  { name: tasks.applicationFeePaid, key: 'record-application-fee-payment', canSubmit: false, label: 'Application fee', apiKey: 'recordApplicationFee', stateKey: 'applicationFeePaid' },
  { name: tasks.form2Sent, key: 'send-form2', canSubmit: false, label: 'Form two', apiKey: 'sendForm2', stateKey: 'form2Sent' },
  { name: tasks.verificationDateRecorded, Model: ViewModelRecordVerificationDates, validation: validateVerificationDates, key: 'submit-form-two', canSubmit: true, label: 'Form 2 confirming dog<br>microchipped and neutered', apiKey: 'submitForm2', stateKey: 'verificationDateRecorded' },
  { name: tasks.microchipDeadlineRecorded, key: 'record-microchip-deadline', canSubmit: false, label: 'When will the dog be fit to be microchipped?', apiKey: 'verifyDates', stateKey: 'verificationDateRecorded' },
  { name: tasks.certificateIssued, key: 'certificate-issued', canSubmit: false, label: 'Certificate of exemption', apiKey: 'certificateIssued', stateKey: 'certificateIssued' }
]

/**
 * @param taskKey
 * @param data
 * @param backNav
 * @param errors
 * @return {*}
 */
const createModel = (taskKey, data, backNav, errors = null) => {
  const task = taskList.find(x => x.key === taskKey)

  if (task === undefined) {
    throw new Error(`Invalid task ${taskKey} when getting model`)
  }

  data.taskName = taskKey

  return new task.Model(data, backNav, errors)
}

const getTaskDetails = taskName => {
  const task = taskList.find(x => x.name === taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${taskName} when getting details`)
  }

  return { key: task.key, label: task.label, apiKey: task.apiKey, stateKey: task.stateKey }
}

const getTaskDetailsByKey = taskKey => {
  const task = taskList.find(x => x.key === taskKey)
  if (task === undefined) {
    throw new Error(`Invalid task ${taskKey} when getting details`)
  }

  return { key: task.key, label: task.label, apiKey: task.apiKey, stateKey: task.stateKey }
}

const verificationData = ({ verificationOptions, ...data }, request, payload) => {
  let dogDeclaredUnfit = verificationOptions.dogDeclaredUnfit
  let neuteringBypassedUnder16 = verificationOptions.neuteringBypassedUnder16

  const sessionData = getVerificationPayload(request)

  if (sessionData && Object.keys(sessionData).length) {
    dogDeclaredUnfit = sessionData.dogNotFitForMicrochip ?? false
    neuteringBypassedUnder16 = sessionData.dogNotNeutered ?? false

    data['neuteringConfirmation-day'] = sessionData['neuteringConfirmation-day']
    data['neuteringConfirmation-month'] = sessionData['neuteringConfirmation-month']
    data['neuteringConfirmation-year'] = sessionData['neuteringConfirmation-year']

    data.neuteringConfirmation = neuteringBypassedUnder16 ? undefined : sessionData.neuteringConfirmation
  }

  if (Object.keys(payload).length) {
    dogDeclaredUnfit = payload.dogNotFitForMicrochip !== undefined
    neuteringBypassedUnder16 = payload.dogNotNeutered !== undefined
  }

  return {
    ...data,
    verificationOptions: {
      ...verificationOptions,
      dogDeclaredUnfit,
      neuteringBypassedUnder16
    }
  }
}

/**
 * @param dogIndex
 * @param taskName
 * @param user
 * @param request
 * @param [payload]
 * @return {Promise<{[p: string]: *}>}
 */
const getTaskData = async (dogIndex, taskName, user, request, payload = {}) => {
  const taskData = getTaskDetailsByKey(taskName)
  const savedTask = await getCdoTaskDetails(dogIndex, user)
  const taskState = savedTask.tasks[taskData.stateKey]
  let data = { indexNumber: dogIndex, ...savedTask, task: { ...taskState }, ...payload }
  delete data.task.tasks

  if (taskName === 'record-verification-dates') {
    data = verificationData(data, request, payload)
  } else if (taskName === 'record-microchip-deadline') {
    data.hidden = getVerificationPayload(request)
  }

  return data
}

module.exports = {
  createModel,
  getTaskDetails,
  getTaskData
}
