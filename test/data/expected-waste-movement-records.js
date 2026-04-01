/** Expected waste movement payloads keyed by yourUniqueReference (from spreadsheet test data). */
export const EXPECTED_WASTE_MOVEMENT_RECORDS = {
  TM170224262: {
    yourUniqueReference: 'TM170224262',
    receiver: {
      siteName: 'Test Enviro Services',
      authorisationNumber: 'EPR/AB6061CD',
      regulatoryPositionStatements: [257],
      emailAddress: 'autotest.ee2026+1@gmail.com',
      phoneNumber: '0168 555 8781'
    },
    receipt: {
      address: {
        fullAddress: '311 Industrial Estate, Birmingham',
        postcode: 'B12 3XY'
      }
    },
    dateTimeReceived: {
      $date: '2026-02-16T16:00:00Z'
    },
    reasonForNoConsignmentCode: 'NO_DOC_WITH_WASTE',
    specialHandlingRequirements: 'highly toxic , handle with care',
    carrier: {
      reasonForNoRegistrationNumber: 'ONE_OFF',
      organisationName: 'Test Waste Management Logistics UK',
      address: {
        fullAddress: '321 Test Street, Test City',
        postcode: 'W12 8AN'
      },
      emailAddress: 'test@carrier.com',
      phoneNumber: '1234567890',
      meansOfTransport: 'Road',
      vehicleRegistration: 'FH56 PER',
      registrationNumber: ''
    },
    brokerOrDealer: {
      organisationName: 'Test broker 1',
      address: {
        fullAddress: '46 city, new bulid',
        postcode: 'W12 8AN'
      },
      emailAddress: 'testbroker1@mail.com',
      phoneNumber: '45345345',
      registrationNumber: 'CBDL101999'
    },
    wasteItems: [
      {
        ewcCodes: ['030201', '030203'],
        wasteDescription: 'Absolute hazardous waste',
        physicalForm: 'Powder',
        numberOfContainers: 3,
        typeOfContainers: 'FIB',
        weight: {
          metric: 'Kilograms',
          amount: 50,
          isEstimate: false
        },
        containsPops: true,
        pops: {
          components: [
            {
              code: 'END',
              concentration: 4.5
            },
            {
              code: 'SCCPS',
              concentration: 94
            }
          ],
          sourceOfComponents: 'GUIDANCE'
        },
        containsHazardous: true,
        hazardous: {
          hazCodes: ['HP_4'],
          components: [
            {
              name: 'Chromium',
              concentration: 34
            },
            {
              name: 'arsenic trioxide',
              concentration: 87
            }
          ],
          sourceOfComponents: 'PROVIDED_WITH_WASTE'
        },
        disposalOrRecoveryCodes: [
          {
            code: 'R1',
            weight: {
              metric: 'Kilograms',
              amount: 50,
              isEstimate: true
            }
          }
        ]
      },
      {
        ewcCodes: ['040214'],
        wasteDescription: 'Wastes from the leather, fur and textile industries',
        physicalForm: 'Solid',
        numberOfContainers: 1,
        typeOfContainers: 'BOX',
        weight: {
          metric: 'Tonnes',
          amount: 1,
          isEstimate: true
        },
        containsPops: false,
        containsHazardous: true,
        hazardous: {
          hazCodes: ['HP_3'],
          components: [
            {
              name: 'benzene',
              concentration: 8
            }
          ],
          sourceOfComponents: 'GUIDANCE'
        },
        disposalOrRecoveryCodes: [
          {
            code: 'D1',
            weight: {
              metric: 'Tonnes',
              amount: 1.1,
              isEstimate: true
            }
          }
        ]
      },
      {
        ewcCodes: ['010102'],
        wasteDescription: 'Wastes from mineral metalliferous excavation',
        physicalForm: 'Gas',
        numberOfContainers: 20,
        typeOfContainers: 'TAN',
        weight: {
          metric: 'Tonnes',
          amount: 10,
          isEstimate: true
        },
        containsPops: false,
        containsHazardous: false,
        disposalOrRecoveryCodes: [
          {
            code: 'R3',
            weight: {
              metric: 'Tonnes',
              amount: 10,
              isEstimate: true
            }
          }
        ]
      },
      {
        ewcCodes: ['010102', '010304'],
        wasteDescription: 'Wastes from mineral metalliferous excavation',
        physicalForm: 'Gas',
        numberOfContainers: 20,
        typeOfContainers: 'BAG',
        weight: {
          metric: 'Tonnes',
          amount: 10,
          isEstimate: true
        },
        containsPops: true,
        pops: {
          components: [
            {
              code: 'PFOS',
              concentration: 98.6
            },
            {
              code: 'PBDES',
              concentration: 0.9
            }
          ],
          sourceOfComponents: 'OWN_TESTING'
        },
        containsHazardous: true,
        hazardous: {
          hazCodes: ['HP_5', 'HP_6', 'HP_7'],
          components: [
            {
              name: 'Cadmium',
              concentration: 9.8
            },
            {
              name: 'Hexavalent chromium',
              concentration: 8
            },
            {
              name: 'Toluene',
              concentration: 0.8
            }
          ],
          sourceOfComponents: 'OWN_TESTING'
        },
        disposalOrRecoveryCodes: [
          {
            code: 'R4',
            weight: {
              metric: 'Kilograms',
              amount: 6,
              isEstimate: false
            }
          },
          {
            code: 'D12',
            weight: {
              metric: 'Kilograms',
              amount: 6.8,
              isEstimate: false
            }
          }
        ]
      },
      {
        ewcCodes: ['010102', '040214', '020106'],
        wasteDescription: 'Wastes from mineral metalliferous excavation',
        physicalForm: 'Liquid',
        numberOfContainers: 20,
        typeOfContainers: 'BAL',
        weight: {
          metric: 'Tonnes',
          amount: 10,
          isEstimate: true
        },
        containsPops: false,
        containsHazardous: false,
        disposalOrRecoveryCodes: [
          {
            code: 'R3',
            weight: {
              metric: 'Tonnes',
              amount: 10,
              isEstimate: true
            }
          }
        ]
      }
    ]
  },
  TM170224261: {
    yourUniqueReference: 'TM170224261',
    receiver: {
      siteName: 'Test Enviro Services',
      authorisationNumber: 'EPR/AB6061CD',
      regulatoryPositionStatements: [257],
      emailAddress: 'autotest.ee2026+1@gmail.com',
      phoneNumber: '0167 555 8781'
    },
    receipt: {
      address: {
        fullAddress: '310 Industrial Estate, Birmingham',
        postcode: 'B12 3XY'
      }
    },
    dateTimeReceived: {
      $date: '2026-02-15T14:03:00Z'
    },
    hazardousWasteConsignmentCode: 'SB1234567',
    carrier: {
      registrationNumber: 'CBDL999999',
      organisationName: 'Test Waste Management Logistics UK',
      address: {
        fullAddress: '321 Test Street, Test City',
        postcode: 'W12 8AN'
      },
      emailAddress: 'test@carrier.com',
      phoneNumber: '1234567890',
      meansOfTransport: 'Rail'
    },
    brokerOrDealer: {
      organisationName: 'Test broker',
      address: {
        fullAddress: '45 city, new bulid',
        postcode: 'W12 8AN'
      },
      emailAddress: 'testbroker@mail.com',
      phoneNumber: '46456',
      registrationNumber: 'CBDL109999'
    },
    wasteItems: [
      {
        ewcCodes: ['010304', '010309'],
        wasteDescription: 'Wastes from mineral metalliferous excavation',
        physicalForm: 'Gas',
        numberOfContainers: 20,
        typeOfContainers: 'TAN',
        weight: {
          metric: 'Tonnes',
          amount: 10,
          isEstimate: true
        },
        containsPops: true,
        pops: {
          components: [
            {
              code: 'CHL',
              concentration: 250
            },
            {
              code: 'TOX',
              concentration: 156.4
            },
            {
              code: 'DCF',
              concentration: 0.8
            },
            {
              code: 'DDT',
              concentration: 1.2
            }
          ],
          sourceOfComponents: 'PROVIDED_WITH_WASTE'
        },
        containsHazardous: false,
        disposalOrRecoveryCodes: [
          {
            code: 'R1',
            weight: {
              metric: 'Tonnes',
              amount: 7.5,
              isEstimate: true
            }
          }
        ]
      },
      {
        ewcCodes: ['010304'],
        wasteDescription: 'Basic mixed construction and demolition waste',
        physicalForm: 'Solid',
        numberOfContainers: 1,
        typeOfContainers: 'BOX',
        weight: {
          metric: 'Kilograms',
          amount: 12,
          isEstimate: false
        },
        containsPops: false,
        containsHazardous: true,
        hazardous: {
          hazCodes: ['HP_1', 'HP_3'],
          sourceOfComponents: 'NOT_PROVIDED'
        },
        disposalOrRecoveryCodes: [
          {
            code: 'R4',
            weight: {
              metric: 'Kilograms',
              amount: 6,
              isEstimate: false
            }
          },
          {
            code: 'D12',
            weight: {
              metric: 'Kilograms',
              amount: 6.8,
              isEstimate: false
            }
          }
        ]
      },
      {
        ewcCodes: ['010102'],
        wasteDescription: 'Wastes from mineral metalliferous excavation',
        physicalForm: 'Powder',
        numberOfContainers: 20,
        typeOfContainers: 'CAN',
        weight: {
          metric: 'Tonnes',
          amount: 10,
          isEstimate: true
        },
        containsPops: false,
        containsHazardous: false,
        disposalOrRecoveryCodes: [
          {
            code: 'R3',
            weight: {
              metric: 'Tonnes',
              amount: 10,
              isEstimate: true
            }
          }
        ]
      }
    ]
  }
}
