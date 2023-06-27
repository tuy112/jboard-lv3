'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    static associate(models) {
      // define association here
    }
  }
  user.init({
    userId: DataTypes.STRING,
    passwordl: DataTypes.STRING,
    passwordCheck: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};