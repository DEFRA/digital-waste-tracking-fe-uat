// MongoDB seed script for DWT admin test organisations. Used by WasteOrganisationsReport and GetOrganisationsByDateRange features — run in the target test environment before those tests.
// DWT admin test - 1  | orgID: 6d35c84d-b4f8-4f8d-84db-39f9894c1a6a  | Created: 2024-01-18 09:14:26 UTC | API Codes: 1  (1 active,  0 inactive, 0 null)
// DWT admin test - 2  | orgID: ec12b2d2-f7c6-40e9-a5ef-9bdb1c8d6581  | Created: 2024-02-11 13:27:41 UTC | API Codes: 3  (0 active,  3 inactive, 0 null)
// DWT admin test - 3  | orgID: bfc57d9f-9ef6-4c6d-a34e-0d69b79a4db0  | Created: 2024-03-10 16:45:12 UTC | API Codes: 11 (11 active, 0 inactive, 0 null)
// DWT admin test - 4  | orgID: c8cbe6cb-9af7-4b80-8b82-538d76ecad43  | Created: 2024-03-18 08:30:55 UTC | API Codes: 4  (1 active,  3 inactive, 0 null)
// DWT admin test - 5  | orgID: c1f1d0cf-5b95-4d0d-b8b3-0bc80b77b78f  | Created: 2024-03-24 21:15:09 UTC | API Codes: 2  (0 active,  0 inactive, 2 null)
// DWT admin test - 6  | orgID: 74dc6d88-2816-4d39-b983-63d35f4cb9af  | Created: 2024-03-25 00:00:00 UTC | API Codes: 1  (1 active,  0 inactive, 0 null)
// DWT admin test - 7  | orgID: 28c74af7-d1df-4c22-a4fc-6945d04bdce2  | Created: 2024-09-15 14:59:59 UTC | API Codes: 1  (1 active,  0 inactive, 0 null)
// DWT admin test - 8  | orgID: 0dd9bcf4-1bd2-4c91-8b87-7b76b7a2d90c  | Created: 2024-03-25 00:00:00 UTC | API Codes: 4  (4 active,  0 inactive, 0 null)
// DWT admin test - 9  | orgID: f42bc5d3-2d0c-4b31-ae90-d44a472cf958  | Created: 2024-03-25 00:00:00 UTC | API Codes: 9  (9 active,  0 inactive, 0 null)
// DWT admin test - 10 | orgID: b8f90b0c-6156-4f58-8df5-b76e5ebcfd67  | Created: 2024-03-25 00:00:00 UTC | API Codes: 1  (1 active,  0 inactive, 0 null)
// DWT admin test - 11 | orgID: d4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f11  | Created: 2024-12-22 09:30:00 UTC | API Codes: 4  (2 active,  1 inactive, 1 null)
// DWT admin test - 12 | orgID: e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a12  | Created: 2024-12-22 19:20:15 UTC | API Codes: 1  (0 active,  1 inactive, 0 null)
// DWT admin test - 13 | orgID: f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b13  | Created: 2024-12-22 23:45:00 UTC | API Codes: 0  (0 active,  0 inactive, 0 null)

// Delete any existing test documents if they exist
db.organisations.deleteMany({
  name: { $regex: 'DWT admin test', $options: 'i' }
})

db.organisations.insertMany([
  // Document 1 - 1 active API code
  {
    organisationId: '6d35c84d-b4f8-4f8d-84db-39f9894c1a6a',
    apiCodes: [
      {
        code: 'c1ef5c65-c89d-4f79-8bdb-6df7cbe92645',
        name: 'API Code A17',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 1',
    users: ['ef6d8740-9447-47d6-9d4d-4e8d6b804b33'],
    createdAt: ISODate('2024-01-18T09:14:26.000Z'),
    updatedAt: ISODate('2024-01-18T09:14:26.000Z')
  },
  // Document 2 - 3 inactive API codes
  {
    organisationId: 'ec12b2d2-f7c6-40e9-a5ef-9bdb1c8d6581',
    apiCodes: [
      {
        code: '9bb7fd28-2e53-44c2-8f56-c9fb4d9fcbb7',
        name: 'API Code B01',
        isDisabled: true
      },
      {
        code: '92b97f13-8412-4b17-bf62-2d47d0a48916',
        name: 'API Code B02',
        isDisabled: true
      },
      {
        code: '0f13c2c8-7869-4b92-b770-47b0df6cf3b5',
        name: 'API Code B03',
        isDisabled: true
      }
    ],
    version: 1,
    name: 'DWT admin test - 2',
    users: ['c2afed58-c84f-4cf0-865f-685a84fd80d8'],
    createdAt: ISODate('2024-02-11T13:27:41.000Z'),
    updatedAt: ISODate('2024-02-11T13:27:41.000Z')
  },
  // Document 3 - 11 active API codes
  {
    organisationId: 'bfc57d9f-9ef6-4c6d-a34e-0d69b79a4db0',
    apiCodes: [
      {
        code: 'ff56b4f4-b32f-41a6-a8d7-90c3d6d87f01',
        name: 'API Code C01',
        isDisabled: false
      },
      {
        code: '438e2f7f-03bb-4960-aac5-f4bb4ec12f02',
        name: 'API Code C02',
        isDisabled: false
      },
      {
        code: '1ebdc956-ef72-47e2-b15d-3fa935cb7d03',
        name: 'API Code C03',
        isDisabled: false
      },
      {
        code: 'f5d96ab0-4d92-40e4-a6dc-6848d1c24504',
        name: 'API Code C04',
        isDisabled: false
      },
      {
        code: '64b6ec85-20cb-4f68-9c5f-74ab06c9b905',
        name: 'API Code C05',
        isDisabled: false
      },
      {
        code: 'f19a59a4-c0bb-4fbf-b644-8de87a849506',
        name: 'API Code C06',
        isDisabled: false
      },
      {
        code: '5d89ddbc-71a4-4c69-8f4c-17d2c4d2d907',
        name: 'API Code C07',
        isDisabled: false
      },
      {
        code: 'dbdf63c5-7a1c-46fd-b34c-9fb1d09d2b08',
        name: 'API Code C08',
        isDisabled: false
      },
      {
        code: 'e40be08d-6dc3-4d43-a8d5-fb97ebcdb709',
        name: 'API Code C09',
        isDisabled: false
      },
      {
        code: 'c98708aa-3dfd-4d7d-9628-3dbb8d8d8f10',
        name: 'API Code C10',
        isDisabled: false
      },
      {
        code: '861b2678-cd64-45a7-b0ef-605b14e5d611',
        name: 'API Code C11',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 3',
    users: ['fbc972b0-7581-43f6-bc0d-f76d8cb9b8af'],
    createdAt: ISODate('2024-03-10T16:45:12.000Z'),
    updatedAt: ISODate('2024-03-10T16:45:12.000Z')
  },
  // Document 4 - 4 API codes (3 inactive, 1 active)
  {
    organisationId: 'c8cbe6cb-9af7-4b80-8b82-538d76ecad43',
    apiCodes: [
      {
        code: '28dbdc18-83d6-4a07-a2e7-1f0d6fb2b401',
        name: 'API Code D01',
        isDisabled: true
      },
      {
        code: 'fc876ba9-267d-474e-918d-4d07f2eb6402',
        name: 'API Code D02',
        isDisabled: true
      },
      {
        code: '3ebf5e3f-9316-4c95-a3dc-dff85f1d3c03',
        name: 'API Code D03',
        isDisabled: true
      },
      {
        code: 'fba9d31b-7d67-4787-a70b-b9e8412b3e04',
        name: 'API Code D04',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 4',
    users: ['4a7d3023-420d-4f35-b923-513b6d3cf59d'],
    createdAt: ISODate('2024-03-18T08:30:55.000Z'),
    updatedAt: ISODate('2024-03-18T08:30:55.000Z')
  },
  // Document 5 - 2 API codes with null isDisabled
  {
    organisationId: 'c1f1d0cf-5b95-4d0d-b8b3-0bc80b77b78f',
    apiCodes: [
      {
        code: '8b3873d6-0b55-4c9f-a0ef-0a32403f2201',
        name: 'API Code E01',
        isDisabled: null
      },
      {
        code: '9df6c79b-74fd-43e7-bb55-ef9a8fd6f502',
        name: 'API Code E02',
        isDisabled: null
      }
    ],
    version: 1,
    name: 'DWT admin test - 5',
    users: ['b0d47eb8-d62c-4db9-bd37-cc94c83dce9f'],
    createdAt: ISODate('2024-03-24T21:15:09.000Z'),
    updatedAt: ISODate('2024-03-24T21:15:09.000Z')
  },
  // Document 6 - 25 March 2024 midnight, 1 active API code
  {
    organisationId: '74dc6d88-2816-4d39-b983-63d35f4cb9af',
    apiCodes: [
      {
        code: 'a55dc3a9-d7c0-4a5d-b5e5-61d986884b11',
        name: 'API Code F01',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 6',
    users: ['f3d2f7ce-9436-4c84-a3d0-4bb3d9a8fd72'],
    createdAt: ISODate('2024-03-25T00:00:00.000Z'),
    updatedAt: ISODate('2024-03-25T00:00:00.000Z')
  },
  // Document 7 - 15 September 2024 14:59:59
  {
    organisationId: '28c74af7-d1df-4c22-a4fc-6945d04bdce2',
    apiCodes: [
      {
        code: 'cb85652b-8229-4ef5-b84c-84ef69e3fa71',
        name: 'API Code G01',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 7',
    users: ['6fae5087-ef8d-495d-a508-2fbfcbcbfd43'],
    createdAt: ISODate('2024-09-15T14:59:59.000Z'),
    updatedAt: ISODate('2024-09-15T14:59:59.000Z')
  },
  // Document 8 - Same createdAt as document 6, 4 active API codes
  {
    organisationId: '0dd9bcf4-1bd2-4c91-8b87-7b76b7a2d90c',
    apiCodes: [
      {
        code: 'ef536d0c-8d5f-449d-8e3d-f80c5b3f8b01',
        name: 'API Code H01',
        isDisabled: false
      },
      {
        code: '2e7692b5-cab0-4492-b8d9-fac1b0e4e802',
        name: 'API Code H02',
        isDisabled: false
      },
      {
        code: '03d5f4f6-f4d0-4dc9-a4fd-dc770d9f4903',
        name: 'API Code H03',
        isDisabled: false
      },
      {
        code: '33a9ebd8-bf59-4c6f-84d6-99b955689404',
        name: 'API Code H04',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 8',
    users: ['f54a09d3-8183-4547-b879-f856f12d75a0'],
    createdAt: ISODate('2024-03-25T00:00:00.000Z'),
    updatedAt: ISODate('2024-03-25T00:00:00.000Z')
  },
  // Document 9 - Same createdAt as document 6, 9 active API codes
  {
    organisationId: 'f42bc5d3-2d0c-4b31-ae90-d44a472cf958',
    apiCodes: [
      {
        code: 'dc51ab3d-8d91-429f-8a18-d255b15d6901',
        name: 'API Code I01',
        isDisabled: false
      },
      {
        code: '3d94f706-a5d2-44f3-a174-bfcf6a76d102',
        name: 'API Code I02',
        isDisabled: false
      },
      {
        code: 'd9628d5f-81d2-4d9b-a29f-67cba7b6c503',
        name: 'API Code I03',
        isDisabled: false
      },
      {
        code: '4d7d7e54-62ea-4a65-a9b9-a5a4ce693704',
        name: 'API Code I04',
        isDisabled: false
      },
      {
        code: '57b59ec5-86ea-4b3f-bb75-8519b8f81205',
        name: 'API Code I05',
        isDisabled: false
      },
      {
        code: 'cdd48d0b-36d4-42bb-b5c0-46a0864dc706',
        name: 'API Code I06',
        isDisabled: false
      },
      {
        code: '0c10de3f-786e-4a82-b98f-8d6d7d70eb07',
        name: 'API Code I07',
        isDisabled: false
      },
      {
        code: '6cb39ef4-a2e6-466e-8c96-0c98d3bdb808',
        name: 'API Code I08',
        isDisabled: false
      },
      {
        code: 'ec46e87b-462f-4e7f-81d7-c703f78dc809',
        name: 'API Code I09',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 9',
    users: ['fa7e3b89-80d2-47b7-8ff4-d0fd0fd9bc4f'],
    createdAt: ISODate('2024-03-25T00:00:00.000Z'),
    updatedAt: ISODate('2024-03-25T00:00:00.000Z')
  },
  // Document 10 - Same createdAt as document 6, 1 active API code
  {
    organisationId: 'b8f90b0c-6156-4f58-8df5-b76e5ebcfd67',
    apiCodes: [
      {
        code: '74cfdbdb-6544-4cc0-a584-9610d5ec1d9d',
        name: 'API Code J01',
        isDisabled: false
      }
    ],
    version: 1,
    name: 'DWT admin test - 10',
    users: ['84e88f03-c084-4cb0-a69f-3b63c7f1af2d'],
    createdAt: ISODate('2024-03-25T00:00:00.000Z'),
    updatedAt: ISODate('2024-03-25T00:00:00.000Z')
  },
  // Document 11 - 22 December 2024 morning, 4 API codes (2 active, 1 inactive, 1 null)
  {
    organisationId: 'd4e5f6a7-b8c9-4d0e-1f2a-3b4c5d6e7f11',
    apiCodes: [
      {
        code: 'a1b2c3d4-1111-4111-8111-111111110101',
        name: 'API Code K01',
        isDisabled: false
      },
      {
        code: 'a1b2c3d4-1111-4111-8111-111111110102',
        name: 'API Code K02',
        isDisabled: false
      },
      {
        code: 'a1b2c3d4-1111-4111-8111-111111110103',
        name: 'API Code K03',
        isDisabled: true
      },
      {
        code: 'a1b2c3d4-1111-4111-8111-111111110104',
        name: 'API Code K04',
        isDisabled: null
      }
    ],
    version: 1,
    name: 'DWT admin test - 11',
    users: ['b1c2d3e4-1111-4111-8111-111111110011'],
    createdAt: ISODate('2024-12-22T09:30:00.000Z'),
    updatedAt: ISODate('2024-12-22T09:30:00.000Z')
  },
  // Document 12 - 22 December 2024 evening, 1 inactive API code
  {
    organisationId: 'e5f6a7b8-c9d0-4e1f-2a3b-4c5d6e7f8a12',
    apiCodes: [
      {
        code: 'b2c3d4e5-1212-4121-8121-121212120201',
        name: 'API Code L01',
        isDisabled: true
      }
    ],
    version: 1,
    name: 'DWT admin test - 12',
    users: ['c2d3e4f5-1212-4121-8121-121212120012'],
    createdAt: ISODate('2024-12-22T19:20:15.000Z'),
    updatedAt: ISODate('2024-12-22T19:20:15.000Z')
  },
  // Document 13 - 22 December 2024 night, empty API codes array
  {
    organisationId: 'f6a7b8c9-d0e1-4f2a-3b4c-5d6e7f8a9b13',
    apiCodes: [],
    version: 1,
    name: 'DWT admin test - 13',
    users: ['d3e4f5a6-1313-4131-8131-131313130013'],
    createdAt: ISODate('2024-12-22T23:45:00.000Z'),
    updatedAt: ISODate('2024-12-22T23:45:00.000Z')
  }
])
