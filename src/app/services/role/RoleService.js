import { RoleRepository } from "../../repositories/role/RoleRepository";

export class RoleService {

  constructor() {
    this._roleRepository = new RoleRepository();
  }

  async findOne(filterFunction) {
    return await this._roleRepository.findOne(filterFunction);
  }
}
