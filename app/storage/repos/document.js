const { blobServiceClient } = require('../get-blob-client')
const { blobConfig } = require('../../config')

const maxAttempts = 20

const downloadDocument = async (indexNumber, documentId) => {
  const filename = `${indexNumber}/${documentId}.pdf`

  const containerClient = blobServiceClient.getContainerClient(blobConfig.documentContainer)
  const blobClient = containerClient.getBlobClient(filename)

  let exists
  let attempts = 0

  do {
    exists = await blobClient.exists()

    if (!exists) {
      await new Promise(resolve => setTimeout(resolve, 1000))
    }

    attempts++
  } while (!exists && attempts < maxAttempts)

  if (!exists) {
    console.log('downloadBlob not exists after 20 tries')

    const error = new Error(`Document '${filename}' does not exist`)

    error.type = 'DocumentNotFound'

    throw error
  }

  return blobClient.downloadToBuffer()
}

module.exports = {
  downloadDocument
}
