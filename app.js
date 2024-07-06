require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const knex = require('./config/knex');
const delayJob = require('./config/agenda');
const logger = require('./config/logger');
const error_handler = require('./modules/utils/error_handler');
const v1Router = require('./modules/v1/route');
const newError = require('./modules/utils/new_error');

const app = express();
const PORT = process.env.APP_PORT || 7777;

// cors
app.use(cors());

// accept json body request
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(morgan('dev'));

app.get('/', (_, res) => res.send('Application is running well'));
app.use('/api/v1/', v1Router);

app.use('*', () => {
  throw newError(404, 'Not found');
});

// use error handler to catch error
app.use(error_handler);

app.listen(PORT, async () => {
  logger.info(`Server running on port ${PORT}`);

  knex
    .raw('SELECT 1')
    .then(() => {
      logger.info(`Database Connected`);
    })
    .catch((e) => {
      logger.error(`Failed to connect database: ${e.stack}`);
    });

  await delayJob();
});

module.exports = app;
