const Joi = require('joi')
const { routes, views } = require('../../../constants/cdo/dog')
const { enforcement } = require('../../../auth/permissions')
const ViewModel = require('../../../models/cdo/view/document')
const { getCdo } = require('../../../api/ddi-index-api/cdo')
const { addBackNavigation } = require('../../../lib/back-helpers')
const { downloadDocument } = require('../../../storage/repos/document')
const { sendMessage } = require('../../../messaging/outbound/download')
const getUser = require('../../../auth/get-user')
const { errorCodes } = require('../../../constants/forms')
const { getHistoryForDownload } = require('../../../lib/download-helper')

module.exports = [
  {
    method: 'GET',
    path: `${routes.download.get}/{indexNumber}`,
    options: {
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const backNav = addBackNavigation(request)

        return h.view(views.download, new ViewModel(request.params.indexNumber, backNav))
      }
    }
  },
  {
    method: 'POST',
    path: `${routes.download.post}/{indexNumber}`,
    options: {
      validate: {
        payload: Joi.object({
          indexNumber: Joi.string().required(),
          submitButton: Joi.string().allow(null).allow('').optional()
        }),
        failAction: async (_request, h, _error) => {
          return h.response().code(errorCodes.validationError).takeover()
        }
      },
      auth: { scope: enforcement },
      handler: async (request, h) => {
        const indexNumber = request.payload.indexNumber
        const user = getUser(request)

        const history = await getHistoryForDownload(indexNumber, user)

        const cdo = await getCdo(request.params.indexNumber, user)

        if (cdo === undefined) {
          return h.response().code(errorCodes.notFoundError).takeover()
        }

        cdo.history = history

        const documentId = await sendMessage(cdo, user)

        try {
          const cert = await downloadDocument(indexNumber, documentId)

          const downloadFilename = `${indexNumber} - ${cdo.dog.name} - download.pdf`

          return h.response(cert).type('application/pdf').header('Content-Disposition', `filename="${downloadFilename}"`)
        } catch (err) {
          console.log(`Error generating download: ${err} ${err?.stack}`)
          if (err.type === 'DocumentNotFound') {
            return h.response().code(errorCodes.notFoundError).takeover()
          }

          throw err
        }
      }
    }
  }
]
