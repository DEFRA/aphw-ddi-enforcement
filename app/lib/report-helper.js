const { routes, reportTypes } = require('../constants/cdo/report')
const { getCdo } = require('../api/ddi-index-api/cdo')
const { getPersonByReference, getPersonAndDogs } = require('../api/ddi-index-api/person')

const isSessionValid = (details) => {
  return details?.pk && details.pk !== '' && details?.sourceType && details.sourceType !== ''
}

const getCdoOrPerson = async (sourceType, pk, user) => {
  if (!sourceType || !pk) {
    return null
  }
  return sourceType === 'dog' ? await getCdo(pk, user) : await getPersonByReference(pk, user)
}

const getDogsIndexNumbers = async (details, user) => {
  if (details.sourceType === 'dog') {
    return [details.pk]
  }
  const dogs = await getPersonAndDogs(details.pk, user)
  return dogs.dogs.map(d => d.indexNumber)
}

const buildNextScreenResponse = (nextScreen, overrideIndex = undefined) => {
  return { nextScreen, override: overrideIndex ? { indexNumber: overrideIndex } : undefined }
}

const determineScreenAfterReportType = async (selected, details, backNav, user) => {
  if (selected === reportTypes.inBreach) {
    const dogIndexes = await getDogsIndexNumbers(details, user)
    if (dogIndexes.length > 1) {
      return buildNextScreenResponse(`${routes.selectDog.get}${backNav?.srcHashParam}`)
    }
    return buildNextScreenResponse(`${routes.breachReasons.get}${backNav?.srcHashParam}`, dogIndexes[0])
  } else if (selected === reportTypes.changedAddress) {
    return buildNextScreenResponse(`${routes.postcodeLookup.get}${backNav?.srcHashParam}`)
  } else if (selected === reportTypes.dogDied) {
    const dogIndexes = await getDogsIndexNumbers(details, user)
    if (dogIndexes.length > 1) {
      return buildNextScreenResponse(`${routes.selectDog.get}${backNav?.srcHashParam}`)
    }
    return buildNextScreenResponse(`${routes.dogDied.get}${backNav?.srcHashParam}`, dogIndexes[0])
  }
  return buildNextScreenResponse(`${routes.somethingElse.get}${backNav?.srcHashParam}`)
}

const determineScreenAfterSelectDog = (selected, backNav) => {
  if (selected === reportTypes.inBreach) {
    return `${routes.breachReasons.get}${backNav?.srcHashParam}`
  } else if (selected === reportTypes.dogDied) {
    return `${routes.dogDied.get}${backNav?.srcHashParam}`
  }
  return `${routes.somethingElse.get}${backNav?.srcHashParam}`
}

module.exports = {
  isSessionValid,
  getCdoOrPerson,
  determineScreenAfterReportType,
  determineScreenAfterSelectDog
}
