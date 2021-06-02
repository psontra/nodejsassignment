import { RoleService } from './RoleService'

describe('findOne', () => {

  const roleService = new RoleService()

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const filterFunction = jest.fn()

    const findOne = jest
      .spyOn(roleService._roleRepository, 'findOne')
      .mockResolvedValue({
        id: 'c1afbe9f-11d5-4b8f-b229-9e73245b9170',
        name: 'Admin',
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

    await roleService.findOne(filterFunction)

    expect(findOne).toBeCalledTimes(1)
  })
})