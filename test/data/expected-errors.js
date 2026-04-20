export const EXPECTED_ERRORS = {
  'Test1-update-format-errors-spreadsheet.xlsx': {
    errorsWasteMovementLevel: [
      { row: 10, value: 'Waste Tracking ID is required (B10)' },
      { row: 11, value: 'Waste Tracking ID is required (B11)' },
      { row: 12, value: 'Waste Tracking ID is required (B12)' },
      { row: 13, value: 'Waste Tracking ID is required (B13)' },
      { row: 14, value: 'Waste Tracking ID is required (B14)' },
      { row: 15, value: 'Waste Tracking ID is required (B15)' },
      {
        row: 16,
        value:
          'No waste items for unique reference (C16)\nWaste Tracking ID is required (B16)'
      }
    ],
    errorsWasteItemLevel: [
      {
        row: 11,
        value: 'Cannot parse disposal / recovery codes (R1 = 50 = Kg) (R11)'
      }
    ]
  },
  'Test1-update-api-errors-spreadsheet.xlsx': {
    errorsWasteMovementLevel: [
      {
        row: 9,
        value:
          'postcode must be in valid UK or Ireland format (S9)\nIf carrier.meansOfTransport is "Road" then carrier.vehicleRegistration is required (W9)'
      }
    ],
    errorsWasteItemLevel: [
      {
        row: 9,
        value:
          'ewc codes must be a valid 6-digit numeric code (C9)\ncode must be one of [R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15] (R9)'
      }
    ]
  },
  'Test1-api-errors-spreadsheet.xlsx': {
    errorsWasteMovementLevel: [
      {
        row: 9,
        value:
          'postcode must be in valid UK or Ireland format (S9)\nIf carrier.meansOfTransport is "Road" then carrier.vehicleRegistration is required (W9)'
      }
    ],
    errorsWasteItemLevel: [
      {
        row: 9,
        value:
          'ewc codes must be a valid 6-digit numeric code (C9)\ncode must be one of [R1, R2, R3, R4, R5, R6, R7, R8, R9, R10, R11, R12, R13, D1, D2, D3, D4, D5, D6, D7, D8, D9, D10, D11, D12, D13, D14, D15] (R9)'
      }
    ]
  },
  'Test1-format-errors-spreadsheet.xlsx': {
    errorsWasteMovementLevel: [
      {
        row: 9,
        value: 'Waste Tracking ID must not be present on a create upload (B9)'
      },
      { row: 16, value: 'No waste items for unique reference (C16)' }
    ],
    errorsWasteItemLevel: [
      {
        row: 11,
        value: 'Cannot parse disposal / recovery codes (R1 = 50 = Kg) (R11)'
      }
    ]
  },
  'missing-reference-spreadsheet.xlsx': {
    errorsWasteMovementLevel: [
      { row: 9, value: 'Please provide a value (C9)' },
      { row: 10, value: 'Please provide a value (C10)' },
      { row: 11, value: 'Please provide a value (C11)' },
      { row: 12, value: 'Please provide a value (C12)' },
      { row: 13, value: 'Please provide a value (C13)' }
    ],
    errorsWasteItemLevel: [
      {
        row: 9,
        value:
          'Please provide a value (B9)\nCannot parse disposal / recovery codes (R13) (R9)'
      },
      {
        row: 10,
        value:
          'Please provide a value (B10)\nCannot parse disposal / recovery codes (D15) (R10)'
      },
      {
        row: 11,
        value:
          'Please provide a value (B11)\nCannot parse disposal / recovery codes (R13) (R11)'
      },
      {
        row: 12,
        value:
          'Please provide a value (B12)\nCannot parse disposal / recovery codes (D15) (R12)'
      },
      {
        row: 13,
        value:
          'Please provide a value (B13)\nCannot parse disposal / recovery codes (D15) (R13)'
      },
      {
        row: 14,
        value:
          'Please provide a value (B14)\nCannot parse disposal / recovery codes (R13) (R14)'
      },
      {
        row: 15,
        value:
          'Please provide a value (B15)\nCannot parse disposal / recovery codes (R13) (R15)'
      },
      {
        row: 16,
        value:
          'Please provide a value (B16)\nCannot parse disposal / recovery codes (R13) (R16)'
      },
      {
        row: 17,
        value: 'No waste movements for unique reference (B17)'
      }
    ]
  },
  'missing-reference-spreadsheet-update.xlsx': {
    errorsWasteMovementLevel: [
      {
        row: 9,
        value: 'Please provide a value (C9)\nWaste Tracking ID is required (B9)'
      },
      {
        row: 10,
        value:
          'Please provide a value (C10)\nWaste Tracking ID is required (B10)'
      },
      {
        row: 11,
        value:
          'Please provide a value (C11)\nWaste Tracking ID is required (B11)'
      },
      {
        row: 12,
        value:
          'Please provide a value (C12)\nWaste Tracking ID is required (B12)'
      },
      {
        row: 13,
        value:
          'Please provide a value (C13)\nWaste Tracking ID is required (B13)'
      },
      { row: 14, value: 'Waste Tracking ID is required (B14)' },
      { row: 15, value: 'Waste Tracking ID is required (B15)' }
    ],
    errorsWasteItemLevel: [
      {
        row: 9,
        value:
          'Please provide a value (B9)\nCannot parse disposal / recovery codes (R13) (R9)'
      },
      {
        row: 10,
        value:
          'Please provide a value (B10)\nCannot parse disposal / recovery codes (D15) (R10)'
      },
      {
        row: 11,
        value:
          'Please provide a value (B11)\nCannot parse disposal / recovery codes (R13) (R11)'
      },
      {
        row: 12,
        value:
          'Please provide a value (B12)\nCannot parse disposal / recovery codes (D15) (R12)'
      },
      {
        row: 13,
        value:
          'Please provide a value (B13)\nCannot parse disposal / recovery codes (D15) (R13)'
      },
      {
        row: 14,
        value:
          'Please provide a value (B14)\nCannot parse disposal / recovery codes (R13) (R14)'
      },
      {
        row: 15,
        value:
          'Please provide a value (B15)\nCannot parse disposal / recovery codes (R13) (R15)'
      },
      {
        row: 16,
        value:
          'Please provide a value (B16)\nCannot parse disposal / recovery codes (R13) (R16)'
      },
      {
        row: 17,
        value: 'No waste movements for unique reference (B17)'
      }
    ]
  }
}
