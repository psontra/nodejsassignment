import { AccessHandler } from '../common/authentication/AuthenticationHandler';

import { UserController } from '../controllers/user/UserController';

import { Router } from 'express';

const router = Router();
const userController = new UserController();

router.route('/register')
  .post(
    userController.validate('register'),
    userController.register.bind(userController)
  );

router.route('/login')
  .post(
    userController.validate('login'),
    userController.login.bind(userController)
  );

router.route('/logout')
  .put(
    AccessHandler.Authenticate,
    userController.logout.bind(userController)
  );

router.route('/')
  .get(
    AccessHandler.Authenticate,
    userController.retrieve.bind(userController)
  );

export default router;
