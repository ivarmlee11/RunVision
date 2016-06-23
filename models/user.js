'use strict';

var bcrypt = require('bcrypt');

module.exports = function(sequelize, DataTypes) {
  var user = sequelize.define('user', {
    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: {
          msg: 'Invalid email address'
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8, 20],
          msg: 'Password must be between 8 and 20 characters long'
        }
      }
    },
    name: {
      type: DataTypes.STRING,
      validate: {
      len: {
        args: [1, 20],
        msg: 'Name must be between 1 and 20 characters long'
        }
      }
    }
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    },
    hooks: {
      beforeCreate: function(user, options, cb) {
        // hash password and save hash to user
        var hash = bcrypt.hashSync(user.password, 10);
        user.password = hash;
        cb(null, user);
      }
    }
  });
  return user;
};
