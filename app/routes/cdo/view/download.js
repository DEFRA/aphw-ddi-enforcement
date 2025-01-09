const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/certificate')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { downloadDocument } = require('../../../storage/repos/document')
const { sendMessage } = require('../../../messaging/outbound/download')
const getUser = require('../../../auth/get-user')

module.exports = [
  {
    method: 'GET',
    path: `${routes.download.get}/{indexNumber}`,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const user = getUser(request)
        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const backNav = addBackNavigation(request)

        return h.view(views.download, new ViewModel(cdo.dog.indexNumber, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.download.post}/{dummy?}`,
    options: {
      validate: {
        payload: Joi.object({
          indexNumber: Joi.string().required(),
          submitButton: Joi.string().allow(null).allow('').optional()
        }),
        failAction: async (request, h, error) => {
          return h.response().code(400).takeover()
        }
      },
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const indexNumber = request.payload.indexNumber
        const user = getUser(request)
        const cdo = await getCdo(indexNumber, user)

        if (cdo === undefined) {
          return h.response().code(404).takeover()
        }

        const certificateId = await sendMessage(cdo, user)

        try {
          const cert = await downloadDocument(indexNumber, certificateId)

          const downloadFilename = `${indexNumber} - ${cdo.dog.name} - download.pdf`

          return h.response(cert).type('application/pdf').header('Content-Disposition', `filename="${downloadFilename}"`)
        } catch (err) {
          console.log(`Error generating download: ${err} ${err.stack}`)
          if (err.type === 'CertificateNotFound') {
            return h.response().code(404).takeover()
          }

          throw err
        }
      }
    }
  }
]
