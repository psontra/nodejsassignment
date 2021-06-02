import * as _ from 'lodash';

import { TokenService } from "../../services/token/TokenService";

import { UUID } from "../Enum";

export class AccessHandler {

  static _tokenService = new TokenService();

  constructor() {

  }

  static Authenticate = (req, res, next) => {
    let filterFunction = (items) => {
      return _.find(items, (item) => {
        return item.token === req.get(UUID);
      });
    };

    return AccessHandler._tokenService.findOne(filterFunction)
      .then((token) => {
        if (new Date(token.expiry).getTime() < new Date().getTime()) {
          return res.status(401).json({
            error: 'Unauthorized',
            message: 'Token is expired'
          });
        }

        next();
      }, (err) => {
        return res.status(401).json({
          error: err,
          message: 'Token not found'
        });
      })
  }
}
