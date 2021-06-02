import { MedicineService } from "./MedicineService"

describe('retrieve', () => {

  const medicineService = new MedicineService()

  beforeEach(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  test('should call repository correctly', async () => {
    const queryObject = {}

    const getMedicines = jest
      .spyOn(medicineService._medicineRepository, 'getMedicines')
      .mockResolvedValue([])

    await medicineService.retrieve(queryObject)

    expect(getMedicines).toBeCalledTimes(1)
    expect(getMedicines).toBeCalledWith({})
  })
})