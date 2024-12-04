const { tasks } = require('../../../../constants/cdo/index')
const { getCdoTaskDetails } = require('../../../../api/ddi-index-api/cdo')

const taskList = [
  { name: tasks.applicationPackSent, key: 'send-application-pack', label: 'Application pack', apiKey: 'sendApplicationPack', stateKey: 'applicationPackSent' },
  { name: tasks.insuranceDetailsRecorded, key: 'record-insurance-details', label: 'Evidence of insurance', apiKey: 'recordInsuranceDetails', stateKey: 'insuranceDetailsRecorded' },
  { name: tasks.microchipNumberRecorded, key: 'record-microchip-number', label: 'Microchip number', apiKey: 'recordMicrochipNumber', stateKey: 'microchipNumberRecorded' },
  { name: tasks.applicationFeePaid, key: 'record-application-fee-payment', label: 'Application fee', apiKey: 'recordApplicationFee', stateKey: 'applicationFeePaid' },
  { name: tasks.form2Sent, key: 'send-form2', label: 'Form 2 confirming dog microchipped and neutered', apiKey: 'sendForm2', stateKey: 'form2Sent' },
  { name: tasks.verificationDateRecorded, key: 'record-verification-dates', label: 'Record the verification date for microchip and neutering', apiKey: 'verifyDates', stateKey: 'verificationDateRecorded' },
  { name: tasks.microchipDeadlineRecorded, key: 'record-microchip-deadline', label: 'When will the dog be fit to be microchipped?', apiKey: 'verifyDates', stateKey: 'verificationDateRecorded' }
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

const getValidation = payload => {
  const task = taskList.find(x => x.key === payload?.taskName)
  if (task === undefined) {
    throw new Error(`Invalid task ${payload?.taskName} when getting validation`)
  }

  return task.validation(payload)
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
  const data = { indexNumber: dogIndex, ...savedTask, task: { ...taskState }, ...payload }
  delete data.task.tasks

  return data
}

module.exports = {
  createModel,
  getValidation,
  getTaskData,
  getTaskDetails,
  getTaskDetailsByKey
}
