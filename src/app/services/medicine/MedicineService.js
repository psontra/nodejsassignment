import { MedicineRepository } from "../../repositories/medicine/MedicineRepository"

import * as _ from 'lodash'

export class MedicineService {

  constructor() {
    this._medicineRepository = new MedicineRepository();
  }

  async retrieve(queryObject) {
    return await this._medicineRepository.getMedicines(queryObject);
  }

  async create(item) {
    let filterFunction = (items) => {
      return _.find(items, (it) => {
        return it.name === item.name;
      });
    };

    const medicine = await this._medicineRepository.findOne(filterFunction, false);

    if (medicine) {
      const error = new Error(`Medicine with name ${item.name} is already exist`);

      console.error(error);

      throw error;
    }

    // Format item
    let createMedicineDto = {
      name: '',
      price: '',
    };

    item = _.pick(item, _.keys(createMedicineDto));
    _.assign(createMedicineDto, item);

    return await this._medicineRepository.create(createMedicineDto);
  }
}
