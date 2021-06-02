import { TokenRepository } from "../../repositories/token/TokenRepository";

import * as _ from 'lodash';

const moment = require('moment');

export class TokenService {

  constructor() {
    this._tokenRepository = new TokenRepository();
  }

  /**
   * Create a new token
   * @param item
   * @returns {Promise<void>}
   */
  async create(item) {
    // Format item
    let createTokenDto = {
      token: '',
      expiry: '',
      user: '',
      permissions: []
    };

    item = _.pick(item, _.keys(createTokenDto));
    _.assign(createTokenDto, item);

    return await this._tokenRepository.create(createTokenDto);
  }

  /**
   * Expires a token
   * @param token
   * @returns {Promise<*|Promise<*>>}
   */
  async logout(token) {
    let filterFunction = (items) => {
      return _.find(items, (item) => {
        return item.token === token;
      });
    };

    return this._tokenRepository.findOneAndUpdate(filterFunction, {
      expiry: moment().toDate()
    });
  }

  async findOne(filterFunction) {
    return await this._tokenRepository.findOne(filterFunction);
  }
}
