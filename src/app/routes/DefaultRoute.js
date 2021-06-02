import { Router } from 'express';

const router = Router();

router.route('/health')
  .get(function (req, res, next) {
    res.send('API is running');
  });

export default router;
