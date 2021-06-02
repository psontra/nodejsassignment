import { MedicineService } from "../../services/medicine/MedicineService"

import { body, validationResult } from 'express-validator';

import { PERMISSIONS, RESOURCES } from "../../common/Enum";
import { authorize, itemResult, listResult } from "../../common/Decorators";

export class MedicineController {

  constructor() {
    this._medicineService = new MedicineService();
  }

  @listResult(RESOURCES.MEDICINE)
  @authorize(PERMISSIONS.MEDICINE_VIEW)
  async retrieve(req, res) {
    return this._medicineService.retrieve(req.query);
  }

  @itemResult(RESOURCES.MEDICINE)
  @authorize(PERMISSIONS.MEDICINE_CREATE)
  async create(req, res) {
    return await this._medicineService.create(req.body);
  }

  validate = (method) => {
    switch (method) {
      case 'create': {
        return [[
          body('name', `name doesn't exists`).exists({checkFalsy: true}),
          body('price', `price doesn't exists`).exists({checkFalsy: true}),
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
