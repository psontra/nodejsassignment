import { BaseRepository } from "../common/BaseRepository";

import * as path from 'path';

export class TokenRepository extends BaseRepository {

  constructor() {
    super(path.resolve('./src/app/databases/tokens.json'));
  }
}
