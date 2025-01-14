describe('document template repo', () => {
  const { blobConfig } = require('../../../../app/config')
  const { blobServiceClient } = require('../../../../app/storage/get-blob-client')

  const seedDocument = async () => {
    const container = blobServiceClient.getContainerClient(blobConfig.documentContainer)

    await container.createIfNotExists()

    const templateClient = container.getBlockBlobClient('ED1234/fbab4d37-9614-4db1-b66a-1b562f69ba4d.pdf')
    const template = Buffer.from('{ "hello": "world" }')
    await templateClient.upload(template, template.length)
  }

  afterEach(async () => {
    const container = blobServiceClient.getContainerClient(blobConfig.documentContainer)

    const exists = await container.exists()

    if (exists) {
      await blobServiceClient.deleteContainer(blobConfig.documentContainer)
    }

    jest.clearAllMocks()
    jest.resetModules()
  })

  test('should get document template', async () => {
    const { downloadDocument } = require('../../../../app/storage/repos/document')

    await seedDocument()

    const cert = downloadDocument('ED1234', 'fbab4d37-9614-4db1-b66a-1b562f69ba4d')

    await expect(cert).resolves.toEqual(Buffer.from('{ "hello": "world" }'))
  })

  test('should throw error if exemption template does not exist', async () => {
    const { downloadDocument } = require('../../../../app/storage/repos/document')

    await expect(downloadDocument('ED1234', 'fbab4d37-9614-4db1-b66a-1b562f69ba4d')).rejects.toThrow('Document \'ED1234/fbab4d37-9614-4db1-b66a-1b562f69ba4d.pdf\' does not exist')
  })
})
