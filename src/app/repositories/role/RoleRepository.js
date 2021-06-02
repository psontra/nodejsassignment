import { BaseRepository } from "../common/BaseRepository";

import * as path from 'path';

export class RoleRepository extends BaseRepository {

  constructor() {
    super(path.resolve('./src/app/databases/roles.json'));
  }
}
