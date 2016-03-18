import R from 'ramda';

/**
 * Ramda is useed for the sequelize validation functions so that we can easily create a sequence
 * of validation functions that will be run in order. To make this work, the first function piped
 * into the validator must be the arrayify function and it must be given the instance of sequelize
 * used to define the model.
 *
 * Each validation function must be capable of taking in any number of params and returning those
 * same params as an array. This is why the last parameter for each validation function must use
 * the spread operator.
 *
 * Example validator:
 * beforeValidate: R.pipe( arrayify(sequelize), restrictId );
 */

export const arrayify = (sequelize) => R.curry((...params) => [sequelize, ...params]);

export const restrictId = ([sequelize, model, options, ...params]) => {
  if (model.id) {
    return sequelize.Promise.reject(`${model.$modelOptions.name.singular} cannot define field id.`);
  }

  return [sequelize, model, options, ...params];
};
