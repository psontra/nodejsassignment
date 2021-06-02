import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

const cors = require('cors');

import DefaultRoute from './app/routes/DefaultRoute';
import UserRoute from './app/routes/UserRoute';
import MedicineRoute from './app/routes/MedicineRoute';

// Start server
try {
  const app = express();
  const port = parseInt(process.env.NODE_PORT, 10) || 1111;

  app.set('port', port);

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({extended: true}));
  app.use(cookieParser());
  app.use(cors());

  // region Setup routes
  const router = express.Router();

  router.use('/', DefaultRoute);
  router.use('/users', UserRoute);
  router.use('/medicines', MedicineRoute);

  app.use('/api', router);
  // endregion

  let server = app.listen(port, () => {
    console.log('API Server is running on port ' + port);
  });

  // Begin reading from stdin so the process does not exit immediately
  process.stdin.resume();

  // Graceful shutdown of server
  process.on('SIGINT', () => {
    console.log('Server is shutting down');

    server.close(function () {
      process.exit(0);
    });
  });

  // Graceful shutdown of server - SIGTERM required by Kubernetes
  process.on('SIGTERM', () => {
    console.log('API Server is shutting down');

    server.close(function () {
      process.exit(0);
    });
  });

  process.on('uncaughtException', (err) => {
    console.log(`Uncaught Exception: ${err}`);
  });

  process.on('unhandledRejection', (reason, p) => {
    console.log(`Unhandled Rejection: ${reason}`);
    console.error(p);
  });

} catch (e) {
  console.log(`Can't start API Server`, e);
}

