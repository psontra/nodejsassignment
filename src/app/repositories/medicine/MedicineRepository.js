import { BaseRepository } from "../common/BaseRepository";

import * as path from 'path';
import * as _ from 'lodash';

export class MedicineRepository extends BaseRepository {

  constructor() {
    super(path.resolve('./src/app/databases/medicines.json'));
  }

  async getMedicines(queryObject) {
    const {page, pageSize, price, name} = queryObject;

    const filterFunction = (items) => {
      return _.filter(items, (item) => {
        let condition = true;

        if (price) {
          condition = item.price === price;
        }

        if (name) {
          condition = item.name.indexOf(name) !== -1;
        }

        return condition;
      });
    };

    return await this.retrieve(page, pageSize, filterFunction);
  }
}
