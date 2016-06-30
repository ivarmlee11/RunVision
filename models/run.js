'use strict';
module.exports = function(sequelize, DataTypes) {
  var run = sequelize.define('run', {
    userId: DataTypes.INTEGER,
    name: DataTypes.TEXT,
    imageArray: DataTypes.TEXT,
    latlngArray: DataTypes.TEXT
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
        models.run.belongsTo(models.user);
      }
    }
  });
  return run;
};
