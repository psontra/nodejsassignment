import * as _ from 'lodash';

const moment = require('moment');
import { v4 as uuidv4 } from 'uuid';

import { UserRepository } from '../../repositories/user/UserRepository';

import { TokenService } from "../token/TokenService";
import { RoleService } from "../role/RoleService";


export class UserService {

  constructor() {
    this._userRepository = new UserRepository();
    this._tokenService = new TokenService();
    this._roleService = new RoleService();
  }

  async retrieve(queryObject) {
    return await this._userRepository.getUsers(queryObject);
  }

  async updateById(id, updateObject) {
    return await this._userRepository.updateById(id, updateObject);
  }

  async logout(token) {
    return await this._tokenService.logout(token);
  }

  /**
   * Sign in user
   * @returns {Promise<*>}
   * @param email
   * @param password
   */
  async login(email, password) {
    let filterFunction = (items) => {
      return _.find(items, (item) => {
        return item.email === email;
      });
    };

    let user = await this._userRepository.findOne(filterFunction);

    if (user.password !== password) {
      const error = new Error("Email or password is invalid");
      console.error(error);

      throw error;
    }

    filterFunction = (items) => {
      return _.find(items, (item) => {
        return item.id === user.role;
      });
    };

    const role = await this._roleService.findOne(filterFunction);
    const tokenDto = {
      token: uuidv4(),
      expiry: moment().add(2, "hours").toDate(),
      user: user.id,
      permissions: role.permissions
    };

    const token = await this._tokenService.create(tokenDto);
    user = await this.updateById(user.id, {
      lastAccess: moment().toDate()
    });

    return {
      ...user,
      token: token.token
    };
  }

  /**
   * Create a new user
   * @param item
   * @returns {Promise<void>}
   */
  async register(item) {
    let filterFunction = (items) => {
      return _.find(items, (it) => {
        return it.email === item.email;
      });
    };

    const user = await this._userRepository.findOne(filterFunction, false);

    if (user) {
      const error = new Error(`User with email ${item.email} is already exist`);
      console.error(error);

      throw error;
    }

    // Format item
    let createUserDto = {
      email: '',
      password: '',
      name: '',
      role: 'c1afbe9f-11d5-4b8f-b229-9e73245b9170' // default role is 'Admin',
    };

    item = _.pick(item, _.keys(createUserDto));
    _.assign(createUserDto, item);

    return await this._userRepository.create(createUserDto);
  }
}
