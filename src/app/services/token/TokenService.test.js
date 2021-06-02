import { TokenService } from './TokenService'

import moment from 'moment'

const tokenService = new TokenService()

describe('findOne', () => {


  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const item = {
      expiry: '12:00:00Z',
      token: 'sample',
      user: 'unit-test',
      permissions: [
        'user-view',
        'user-create',
        'user-edit',
        'user-logout',
        'medicine-view',
        'medicine-create',
        'medicine-update',
      ],
    }

    const create = jest
      .spyOn(tokenService._tokenRepository, 'create')
      .mockResolvedValue({})

    await tokenService.create(item)

    expect(create).toBeCalledTimes(1)
    expect(create).toBeCalledWith({
      expiry: '12:00:00Z',
      token: 'sample',
      user: 'unit-test',
      permissions: [
        'user-view',
        'user-create',
        'user-edit',
        'user-logout',
        'medicine-view',
        'medicine-create',
        'medicine-update',
      ],
    })
  })
})

describe('findOne', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const filterFunction = jest.fn()

    const findOne = jest
      .spyOn(tokenService._tokenRepository, 'findOne')
      .mockResolvedValue({
        id: 'c1afbe9f-11d5-4b8f-b229-9e73245b9170',
        expiry: '12:00:00Z',
        token: 'sample',
        user: 'unit-test',
        permissions: [
          'user-view',
          'user-create',
          'user-edit',
          'user-logout',
          'medicine-view',
          'medicine-create',
          'medicine-update',
        ],
      })

    await tokenService.findOne(filterFunction)

    expect(findOne).toBeCalledTimes(1)
  })
})

describe('logout', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const findOneAndUpdate = jest
      .spyOn(tokenService._tokenRepository, 'findOneAndUpdate')
      .mockResolvedValue({
        id: 'c1afbe9f-11d5-4b8f-b229-9e73245b9170',
        expiry: '12:00:00Z',
        token: 'sample',
        user: 'unit-test',
        permissions: [
          'user-view',
          'user-create',
          'user-edit',
          'user-logout',
          'medicine-view',
          'medicine-create',
          'medicine-update',
        ],
      })

    await tokenService.logout(jest.fn())

    expect(findOneAndUpdate).toBeCalledTimes(1)
    expect(findOneAndUpdate).toBeCalledWith(expect.anything(), {
      expiry: expect.any(Date),
    })
  })
})
