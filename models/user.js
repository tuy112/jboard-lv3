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
    usersId: DataTypes.STRING,
    password: DataTypes.STRING,
    passwordCheck: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'users',
  });
  return user;
};