import { createListResult } from "./Helper";

import { UUID } from "./Enum";
import { TokenService } from "../services/token/TokenService";

import * as _ from 'lodash';

// region Response formatting
export function itemResult(resource, isLogin) {
  return function (target, propertyName, descriptor) {
    let method = descriptor.value;

    descriptor.value = function (...params) {
      let req,
        res;

      try {
        [req, res] = params;

        method.apply(this, params)
          .then((result) => {
            if (isLogin) {
              res.header(UUID, result.token);
              delete result.token;
            }

            res.status(200).json({
              data: result,
              meta: {
                resource
              }
            });
          }, (err) => {
            let httpStatus = 400,
              error = {
                resource,
                message: err.message
              };

            if (err.message.indexOf('does not exist in system') !== -1) {
              httpStatus = 404;
            }

            res.status(httpStatus).json(error);
          });

      } catch (err) {
        res.status(500).json({
          resource,
          message: err.message
        });
      }
    }
  }
}

export function listResult(resource) {
  return function (target, propertyName, descriptor) {
    let method = descriptor.value;

    descriptor.value = function (...params) {
      let req,
        res;

      try {
        [req, res] = params;

        method.apply(this, params)
          .then(([count, result]) => {
            const listResult = createListResult(resource, req, (count || count === 0) ? count : result.length, result);

            res.status(200).json(listResult);
          }, (err) => {
            let httpStatus = 400,
              error = {
                resource,
                message: err.message
              };

            if (err.message.indexOf('does not exist in system') !== -1
              || err.message.indexOf('Token not found') !== -1) {
              httpStatus = 404;
            } else if (err.message.indexOf('Insufficient permission') !== -1) {
              httpStatus = 401;
            }

            res.status(httpStatus).json(error);
          });
      } catch (err) {
        res.status(500).json({
          resource,
          message: err.message
        });
      }
    }
  }
}

export function emptyResult(resource) {
  return function (target, propertyName, descriptor) {
    let method = descriptor.value;

    descriptor.value = function (...params) {
      let req,
        res;

      try {
        [req, res] = params;

        method.apply(this, params)
          .then(() => {

            res.status(200).json("");
          }, (err) => {
            let httpStatus = 400,
              error = {
                resource,
                message: err.message
              };

            if (err.message.indexOf('does not exist in system') !== -1) {
              httpStatus = 404;
            }

            res.status(httpStatus).json(error);
          });
      } catch (err) {
        res.status(500).json({
          resource,
          message: err.message
        });
      }
    }
  }
}

// endregion

export function authorize(resource) {
  return function (target, propertyKey, descriptor) {
    let method = descriptor.value;

    descriptor.value = function (...params) {
      // check user has permission on resource
      let req = params[0],
        res = params[1],
        token = req.get(UUID);

      if (!token) {
        const error = new Error('Token not found in request');
        console.error(error);

        throw error;
      }

      // Check user permission
      let tokenService = new TokenService();

      let filterFunction = (items) => {
        return _.find(items, (item) => {
          return item.token === token;
        });
      };

      return tokenService.findOne(filterFunction)
        .then((token) => {
          if (token.permissions.indexOf(resource) === -1) {
            const error = new Error('Insufficient permission');
            console.error(error);

            throw error;
          }

          return method.apply(this, params);
        }, (err) => {
          throw err;
        });
    }
  };
}
