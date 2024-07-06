const { Agenda } = require('@hokify/agenda');
const jobs = require('../modules/jobs');
const logger = require('./logger');

const mongoConnectionString = process.env.MONGODB_CONNECTION_URL;
const agenda = new Agenda({ db: { address: mongoConnectionString } });
module.exports = async () => {
  try {
    await agenda.start();

    await Promise.all(
      jobs.map(async (e) => {
        agenda.define(e.name, e.action, { priority: 'high' });
        await agenda[e.type](e.value, e.name);
      })
    );
  } catch (error) {
    logger.error(error);
  }
};
