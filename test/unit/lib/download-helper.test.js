const { user } = require('../../mocks/auth')

jest.mock('../../../app/api/ddi-index-api/dog')
const { getDogOwner } = require('../../../app/api/ddi-index-api/dog')

jest.mock('../../../app/api/ddi-events-api/event')
const { getEvents } = require('../../../app/api/ddi-events-api/event')

const { getHistoryForDownload } = require('../../../app/lib/download-helper')

const testEvents = [
  {
    type: 'uk.gov.defra.ddi.event.update',
    details: '',
    timestamp: new Date(2024, 5, 5),
    actioningUser: {
      displayname: 'Dev User'
    },
    changes: {
      edited: [
        [
          'cdo_issued',
          '2024-01-16',
          '2024-01-15'
        ],
        [
          'cdo_expiry',
          '2024-02-18',
          '2024-02-19'
        ]
      ]
    }
  },
  {
    type: 'uk.gov.defra.ddi.event.update',
    details: '',
    timestamp: new Date(2024, 5, 8),
    actioningUser: {
      displayname: 'Dev User'
    },
    changes: {
      added: [
        [
          'dog_breaches/0[]',
          'dog not covered by third party insurance'
        ],
        [
          'dog_breaches/1[]',
          'dog away from registered address for over 30 days in one year'
        ],
        [
          'dog_breaches/2[]',
          'exemption certificate not provided to police'
        ]
      ],
      removed: [],
      edited: [
        [
          'status',
          'Pre-exempt',
          'In breach'
        ],
        [
          'dog_breaches',
          [],
          []
        ]
      ]
    }
  }
]

describe('download-helper', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('gets and maps history', async () => {
    getDogOwner.mockResolvedValue({ personReference: 'P-123' })
    getEvents.mockResolvedValue({ events: testEvents })

    const res = await getHistoryForDownload('ED123', user)

    expect(res).toEqual([
      {
        date: '05 June 2024',
        activityLabel: 'CDO issue date updated',
        childList: []
      },
      {
        date: '05 June 2024',
        activityLabel: 'CDO expiry date updated',
        childList: []
      },
      {
        date: '08 June 2024',
        activityLabel: 'Dog status set to In breach',
        childList: [
          ['dog not covered by third party insurance'],
          ['dog away from registered address for over 30 days in one year'],
          ['exemption certificate not provided to police']
        ]
      }
    ])
  })
})
