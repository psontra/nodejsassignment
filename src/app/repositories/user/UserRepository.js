import { BaseRepository } from "../common/BaseRepository";

import * as path from 'path';
import * as _ from 'lodash';

const moment = require('moment');

export class UserRepository extends BaseRepository {

  constructor() {
    super(path.resolve('./src/app/databases/users.json'));
  }

  async getUsers(queryObject) {
    const {page, pageSize, email, name, lastAccess} = queryObject;

    let filterFunction = (items) => {
      return _.filter(items, (item) => {
        let condition = true;

        if (email) {
          condition = item.email.indexOf(email) !== -1;
        }

        if (name) {
          condition = item.name.indexOf(name) !== -1;
        }

        if (lastAccess) {
          condition = moment(item.lastAccess).isSame(moment(lastAccess), 'day');
        }

        return condition;
      });
    };

    return await this.retrieve(page, pageSize, filterFunction);
  }
}
