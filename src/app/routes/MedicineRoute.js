import { AccessHandler } from '../common/authentication/AuthenticationHandler';

import { MedicineController } from '../controllers/medicine/MedicineController';

import { Router } from 'express';

const router = Router();
const medicineController = new MedicineController();

router.route('/')
  .post(
    AccessHandler.Authenticate,
    medicineController.validate('create'),
    medicineController.create.bind(medicineController)
  )
  .get(
    AccessHandler.Authenticate,
    medicineController.retrieve.bind(medicineController)
  );

export default router;
