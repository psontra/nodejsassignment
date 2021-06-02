import { UserService } from '../../services/user/UserService';

import { body, validationResult } from 'express-validator';

import { PERMISSIONS, RESOURCES } from "../../common/Enum";
import { authorize, emptyResult, itemResult, listResult } from "../../common/Decorators";

export class UserController {

  constructor() {
    this._userService = new UserService();
  }

  @listResult(RESOURCES.USER)
  @authorize(PERMISSIONS.USER_VIEW)
  async retrieve(req, res) {
    return this._userService.retrieve(req.query);
  }

  @itemResult(RESOURCES.USER)
  async register(req, res) {
    return await this._userService.register(req.body);
  }

  @emptyResult(RESOURCES.USER)
  @authorize(PERMISSIONS.USER_LOGOUT)
  async logout(req, res) {
    return await this._userService.logout(req.get("uuid"));
  }

  @itemResult(RESOURCES.USER, true)
  async login(req, res) {
    return await this._userService.login(req.body.email, req.body.password);
  }

  validate = (method) => {
    switch (method) {
      case 'register': {
        return [[
          body('name', `name doesn't exists`).exists({checkFalsy: true}),
          body('email', 'Invalid email').exists({checkFalsy: true}).isEmail(),
          body('password', `password doesn't exists`).exists({checkFalsy: true}),
        ], (req, res, next) => {
          // Finds the validation errors in this request and wraps them in an object with handy functions
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(422).json({
              errors: errors.array()
            });
          }

          next();
        }];
      }

      case 'login': {
        return [[
          body('email', 'Invalid email').exists({checkFalsy: true}).isEmail(),
          body('password', `password doesn't exists`).exists({checkFalsy: true}),
        ], (req, res, next) => {
          // Finds the validation errors in this request and wraps them in an object with handy functions
          const errors = validationResult(req);
          if (!errors.isEmpty()) {
            return res.status(422).json({
              errors: errors.array()
            });
          }

          next();
        }];
      }
    }
  };
}
