import fs from 'fs';
import path from 'path';
import Sequelize from 'sequelize';

export default function (options) {
  let env = options.env || process.env.NODE_ENV || 'development';
  let config = require(__dirname + '/../config/config.json')[env];
  let sequelize;
  let db = {};

  if (config.use_env_variable) {
    sequelize = new Sequelize(process.env[config.use_env_variable]);
  } else {
    sequelize = new Sequelize(config.database, config.username, config.password, config);
  }

  fs.readdirSync(__dirname)
  .filter((file) => {
    return file.indexOf('.') !== 0 &&
    file !== path.basename(__filename) &&
    file !== 'shared_validators.js' &&
    file.slice(-3) === '.js';
  })
  .forEach((file) => {
    let model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

  Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
      db[modelName].associate(db);
    }
  });

  db.env = env;
  db.config = config;
  db.sequelize = sequelize;
  db.Sequelize = Sequelize;

  return db;
}
