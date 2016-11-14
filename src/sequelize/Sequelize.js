// @flow

import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';
import { extend } from 'lodash';
import config from '../utils/ConfigUtils';
import log4js from 'log4js';

const db = {};

const logger = log4js.getLogger('[sequelize]');

logger.info('Initializing Sequelize');

// create your instance of sequelize
const sequelize = new Sequelize(config.db.name, config.db.username, config.db.password);

const modelsDirectory = `${__dirname}/models`;

// loop through all files in models directory ignoring hidden files and this file
fs.readdirSync(modelsDirectory)
  .filter((file: string) => ((file.indexOf('.') !== 0) && (file !== 'index.js')))
  // import model files and save model names
  .forEach((file: string) => {
    logger.debug(`Loading model file ${file}`);
    const model = sequelize.import(path.join(modelsDirectory, file));
    db[model.name] = model;
  });

// invoke associations on each of the models
Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].options.hasOwnProperty('associate')) {
    db[modelName].options.associate(db);
  }
});

sequelize
  .authenticate()
  .then(() => (sequelize.sync()))
  .catch((err: Error) => {
    logger.error('Unable to connect to the database:', err);
  });

// assign the sequelize variables to the db object and returning the db.
export default extend({
  sequelize,
  Sequelize,
}, db);
