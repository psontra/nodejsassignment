import { UserService } from "./UserService"

const userService = new UserService()

describe('retrieve', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const queryObject = {}

    const getUsers = jest
      .spyOn(userService._userRepository, 'getUsers')
      .mockResolvedValue([])

    await userService.retrieve(queryObject)

    expect(getUsers).toBeCalledTimes(1)
    expect(getUsers).toBeCalledWith({})
  })
})

describe('updateById', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const id = 'unit-test'
    const updateObject = {}

    const updateById = jest
      .spyOn(userService._userRepository, 'updateById')
      .mockResolvedValue([])

    await userService.updateById(id, updateObject)

    expect(updateById).toBeCalledTimes(1)
    expect(updateById).toBeCalledWith('unit-test', {})
  })
})

describe('register', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const item = {
      email: 'sample',
      password: 'sample',
      name: 'sample',
    }

    const create = jest
      .spyOn(userService._userRepository, 'create')
      .mockResolvedValue({})

    const findOne = jest
      .spyOn(userService._userRepository, 'findOne')
      .mockResolvedValue()

    await userService.register(item)

    expect(create).toBeCalledTimes(1)
    expect(create).toBeCalledWith({
      email: 'sample',
      password: 'sample',
      name: 'sample',
      role: 'c1afbe9f-11d5-4b8f-b229-9e73245b9170'
    })
    expect(findOne).toBeCalledTimes(1)
  })
})

describe('login', () => {

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const email = 'sample'
    const password = 'sample'

    const findOne = jest
      .spyOn(userService._userRepository, 'findOne')
      .mockResolvedValue({
        id: '123',
        email: 'sample',
        password: 'sample',
      })

    const roleFindOne = jest
      .spyOn(userService._roleService, 'findOne')
      .mockResolvedValue({
        permissions: []
      })

    const createToken = jest
      .spyOn(userService._tokenService, 'create')
      .mockResolvedValue({
        token: 'sample'
      })

    const updateById = jest
      .spyOn(userService._userRepository, 'updateById')
      .mockResolvedValue({})

    await userService.login(email, password)

    expect(createToken).toBeCalledTimes(1)
    expect(createToken).toBeCalledWith({
      token: expect.any(String),
      expiry: expect.any(Date),
      user: '123',
      permissions: []
    })
    expect(findOne).toBeCalledTimes(1)
    expect(updateById).toBeCalledTimes(1)
    expect(updateById).toBeCalledWith('123', {
      lastAccess: expect.any(Date)
    })
    expect(roleFindOne).toBeCalledTimes(1)
  })
})
